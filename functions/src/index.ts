// Dependencies for callable functions.
import {onCall, HttpsError} from "firebase-functions/v2/https";
import axios from "axios";
import {defineSecret} from "firebase-functions/params";

// Dependencies for Firestore and FCM.
import * as admin from "firebase-admin";
import {onDocumentUpdated} from "firebase-functions/v2/firestore";
import {getFirestore} from "firebase-admin/firestore";

admin.initializeApp();
const db = getFirestore();
const semaphoreApiKey = defineSecret("SEMAPHORE_APIKEY");

/**
 * Sends a notification to all registered devices about the status of a specific bin.
 *
 * @param {string} location - The location of the bin.
 * @return {Promise<void>}
 */
async function sendNotification(location: string): Promise<void> {
  try {
    // Get all FCM tokens from Firestore
    const tokensSnapshot = await admin
      .firestore()
      .collection("fcmTokens")
      .get();

    const tokens: string[] = [];
    tokensSnapshot.docs.forEach((doc) => {
      const tokenArray = doc.data().tokens as string[];
      if (tokenArray) {
        tokens.push(...tokenArray);
      }
    });

    if (tokens.length > 0) {
      const currentTime = new Date().toLocaleTimeString("en-US", {
        timeZone: "Asia/Manila",
      });
      const message: admin.messaging.MulticastMessage = {
        tokens,
        data: {
          title: "SmartSeg",
          body: `Alert: The bins at ${location.toUpperCase()} are nearing full capacity. Kindly ensure they are emptied soon. Time: ${currentTime}`,
          icon: "https://project-robert-bb066.web.app/notifLogo.png",
        },
      };

      // Send multicast notifications
      const response = await admin.messaging().sendEachForMulticast(message);
      console.log("Notifications sent:", response);
    } else {
      console.log("No tokens available.");
    }
  } catch (error) {
    console.error("Error sending notifications:", error);
  }
}

/**
 * Send sms notifications
 *
 * @param {string} location
 * @param {string[]} contactNumbers
 * @param {string} apikey
 * @return {Promise<void>}
 */
async function sendSMS(
  location: string,
  contactNumbers: string[],
  apikey: string,
): Promise<void> {
  if (contactNumbers.length === 0) {
    console.log("No contact numbers found.");
    return;
  }

  const message = `Alert: The bins at ${location.toUpperCase()} are nearing full capacity. Kindly ensure they are emptied soon.`;
  const numbersString = contactNumbers.join(",");

  const url = "https://api.semaphore.co/api/v4/messages";

  try {
    const response = await axios.post(url, {
      apikey,
      message,
      sendername: "SmartSeg",
      number: numbersString,
    });

    if (response.data && response.data.message_id) {
      console.log(
        `SMS sent successfully to ${numbersString}. Message ID: ${response.data.message_id}`,
      );
    } else {
      console.error("Failed to send SMS. Unexpected response:", response.data);
    }
  } catch (err) {
    console.error("Error sending SMS:", err);
  }
}

/**
 * Checks if SMS notifications are enabled and sends notifications if the bin is full.
 *
 * @return {Promise<boolean>}
 */
async function checkSmsPermission(): Promise<boolean> {
  const docRef = db.collection("notificationSettings").doc("permission");
  const doc = await docRef.get();

  if (doc.exists) {
    const data = doc.data();
    return data?.isEnabled;
  }

  return false;
}

/**
 * Retrieves contact numbers from Firestore
 *
 * @return {Promise<string[]>}
 */
async function getContacts(): Promise<string[]> {
  const contactRef = db.collection("contacts");
  const snapshot = await contactRef.get();

  const contactNumbers: string[] = [];

  snapshot.forEach((doc) => {
    const data = doc.data();
    if (data.isEnabled && data.number) {
      contactNumbers.push(data.number);
    }
  });

  return contactNumbers;
}

export const checkDocuments = onDocumentUpdated(
  {
    document: "/sensor/{sensorID}",
    secrets: [semaphoreApiKey],
  },
  async (event) => {
    const locationName = event.params.sensorID;

    const beforeData = event.data?.before?.data();
    const afterData = event.data?.after?.data();

    if (!afterData || !beforeData) {
      return;
    }

    // Check each field to find the one that changed
    let changedField: {name: string; value: number} = {
      name: "",
      value: 0,
    };
    Object.keys(afterData).forEach((key) => {
      if (beforeData[key] !== afterData[key]) {
        changedField = {name: key, value: afterData[key]};
      }
    });

    if (changedField.name == "") return;

    // Fields to check
    const fieldConfig: {
      [key: string]: {
        max: number;
        min: number;
      };
    } = {
      Paper: {
        max: 210,
        min: 145,
      },
      Bottle: {
        max: 95,
        min: 74,
      },
      Metal: {
        max: 220,
        min: 105,
      },
    };

    // early return if the bin value is below the minimum
    if (changedField.value < fieldConfig[changedField.name].min) {
      return;
    }

    const docRef = db.collection("sensorPercentage").doc(changedField.name);

    // if the value decreases (means its emptied), update the last value
    const average = Math.floor(
      (fieldConfig[changedField.name].max +
        fieldConfig[changedField.name].min) /
        2,
    );
    if (changedField.value < average) {
      await docRef.set({
        lastValue: changedField.value,
      });
    }

    // get the last value that triggers the notification
    let lastValue = 0;
    const doc = await docRef.get();
    if (doc.exists) {
      lastValue = doc.data()?.lastValue;
    }

    // get the percentage
    const basedZeroMin =
      changedField.value - fieldConfig[changedField.name].min;
    const range =
      fieldConfig[changedField.name].max - fieldConfig[changedField.name].min;
    const percentage = Math.floor((basedZeroMin / range) * 100);

    if (percentage > 90 && lastValue + 10 < changedField.value) {
      const smsPermission = await checkSmsPermission();
      if (smsPermission) {
        const apikey = semaphoreApiKey.value();
        const contactNumbers = await getContacts();
        await sendSMS(locationName, contactNumbers, apikey);
      }
      await sendNotification(locationName);

      // update the last value in firestore
      await docRef.set({
        lastValue: changedField.value,
      });
    }
  },
);

export const getSemaphoreAccountData = onCall(
  {secrets: [semaphoreApiKey]},
  async () => {
    const apikey = semaphoreApiKey.value();

    const url = "https://api.semaphore.co/api/v4/account";

    try {
      const response = await axios.get(url, {
        params: {
          apikey,
        },
      });

      return {balance: response.data.credit_balance as number};
    } catch (error) {
      console.error("Error retrieving Semaphore balance:", error);
      throw new HttpsError("internal", "Unable to retrieve balance");
    }
  },
);
