import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { getToken, onMessage } from "firebase/messaging";
import { auth, db, messaging } from "./firebase";
import { warningToast } from "@/utils/Toast";

async function requestPermission() {
  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    await storeTokenToDB();
  }
}

export async function storeTokenToDB() {
  const vapidKey = import.meta.env.VITE_VAPID_KEY;

  const user = auth.currentUser;
  if (user) {
    const userUID = user.uid;

    try {
      const token = await getToken(messaging, { vapidKey: vapidKey });
      if (token) {
        await setDoc(doc(db, "fcmTokens", userUID), {
          token,
          createdAt: serverTimestamp(),
        });

        onMessage(messaging, (payload) => {
          console.log("Message received. ", payload);
          warningToast(payload.notification?.body);
        });
      } else {
        requestPermission();
      }
    } catch (error) {
      console.error(error);
    }
  }
}
