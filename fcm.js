import { getMessaging, getToken, onMessage } from "firebase/messaging";

const messaging = getMessaging();

export function initFCM() {
  
  getToken(messaging, {
    vapidKey: "YOUR_VAPID_KEY"
  }).then(token => {
    
    console.log("FCM TOKEN:", token);
    
    // send token to server
    fetch("/save-token", {
      method: "POST",
      body: JSON.stringify({ token })
    });
    
  });
  
  onMessage(messaging, (payload) => {
    console.log("Notification:", payload);
    alert(payload.notification.title);
  });
}