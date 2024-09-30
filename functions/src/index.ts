// Dependencies for callable functions.
import {onCall, HttpsError} from "firebase-functions/v2/https";
import axios from "axios";
import {defineSecret} from "firebase-functions/params";

// Dependencies for Firestore and FCM.
import * as admin from "firebase-admin";
import {onDocumentUpdated} from "firebase-functions/v2/firestore";

admin.initializeApp();
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

    const tokens: string[] = tokensSnapshot.docs.map(
      (doc) => doc.data().token as string
    );

    if (tokens.length > 0) {
      const message: admin.messaging.MulticastMessage = {
        tokens,
        notification: {
          title: "Project Robert",
          body: `Alert: The bins at ${location.toUpperCase()} are nearing full capacity. Kindly ensure they are emptied soon.`,
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

export const checkDocuments = onDocumentUpdated(
  "sensor/{sensorID}",
  async (event) => {
    const locationName = event.params.sensorID;

    const data = event.data?.after?.data();

    if (!data) {
      console.log("No data found after the update.");
      return;
    }

    // Fields to check
    const fields = ["Paper", "Metal", "Bottle"];

    for (const field of fields) {
      if (data[field] > 90) {
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
    console.log("API Key:", apikey);

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
