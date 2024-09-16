// DONT SAVE IF PRETTIER IS ENABLED

// Dependencies for callable functions.
import {onCall, HttpsError} from "firebase-functions/v2/https";
import axios from "axios";
import {defineSecret} from "firebase-functions/params";

// Dependencies for Firestore and FCM.
import * as admin from "firebase-admin";
import {onDocumentUpdated} from "firebase-functions/v2/firestore";

admin.initializeApp();
const semaphoreApiKey = defineSecret("SEMAPHORE_APIKEY");

export const sendNotification = onDocumentUpdated(
  "sensor/{sensorId}",
  async (event) => {
    const newValue = event.data?.after.data();
    const binValue = newValue?.value;
    const binName = event.params.sensorId; // Extract the bin name (document ID)

    if (binValue > 90) {
      try {
        // Get all FCM tokens from Firestore
        const tokensSnapshot = await admin
          .firestore()
          .collection("fcmTokens")
          .get();

        // Assuming the token is stored as a field under each user's document
        const tokens = tokensSnapshot.docs.map((doc) => doc.data().token);

        if (tokens.length > 0) {
          // Create notification payload
          const message = {
            tokens, // Send to multiple devices
            notification: {
              title: "Project Robert",
              body: `The ${binName} bin is ${binValue}% full. Please empty it soon!`,
            },
          };

          // Send multicast notifications
          const response = await admin
            .messaging()
            .sendEachForMulticast(message);
          console.log("Notifications sent:", response);
        } else {
          console.log("No tokens available.");
        }
      } catch (error) {
        console.error("Error sending notifications:", error);
      }
    }
  }
);

export const getSemaphoreAccoundData = onCall(
  {secrets: [semaphoreApiKey], cors: true},
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
