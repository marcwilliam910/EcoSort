importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyDL3SMIs1Q4JxYitMw8fsgXpnxM5lfiaTA",
  authDomain: "project-robert-bb066.firebaseapp.com",
  projectId: "project-robert-bb066",
  storageBucket: "project-robert-bb066.appspot.com",
  messagingSenderId: "675258928352",
  appId: "1:675258928352:web:60f6722f482e4ff0e35485",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.data.title;
  const notificationBody = {
    body: payload.data.body,
    icon:
      payload.data.icon || "https://project-robert-bb066.web.app/notifLogo.png",
  };

  self.registration.showNotification(notificationTitle, notificationBody);
});
