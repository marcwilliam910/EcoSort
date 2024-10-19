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
      const message: admin.messaging.MulticastMessage = {
        tokens,
        data: {
          title: "EcoSort",
          body: `Alert: The bins at ${location.toUpperCase()} are nearing full capacity. Kindly ensure they are emptied soon.`,
          icon: "https://project-robert-bb066.web.app/logo.png",
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
  apikey: string
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
      sendername: "EcoSort",
      number: numbersString,
    });

    if (response.data && response.data.message_id) {
      console.log(
        `SMS sent successfully to ${numbersString}. Message ID: ${response.data.message_id}`
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
      console.log("No data found after the update.");
      return;
    }

    // Fields to check
    const fields = ["Paper", "Metal", "Bottle"];
    const fieldConfig: {
      [key: string]: {
        max: number;
        min: number;
      };
    } = {
      Paper: {
        max: 180,
        min: 138,
      },
      Bottle: {
        max: 105,
        min: 73,
      },
      Metal: {
        max: 230,
        min: 103,
      },
    };

    for (const field of fields) {
      if (afterData[field] > fieldConfig[field].max) {
        console.warn(`${field} exceeds maximum value!`);
        continue; // Skip further processing for this field
      }

      const basedZeroVal = afterData[field] - fieldConfig[field].min;
      const percentage = Math.floor(
        (basedZeroVal / (fieldConfig[field].max - fieldConfig[field].min)) * 100
      );
      if (percentage > 94) {
        const smsPermission = await checkSmsPermission();
        if (smsPermission) {
          const apikey = semaphoreApiKey.value();
          const contactNumbers = await getContacts();
          await sendSMS(locationName, contactNumbers, apikey);
        }
        await sendNotification(locationName);
        break; // Stop the loop once a field satisfies the condition
      }
    }
  }
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
  }
);
