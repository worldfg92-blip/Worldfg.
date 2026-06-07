const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert(require("./serviceAccount.json"))
});

function sendNotification(token, title, body) {
  
  const message = {
    notification: {
      title,
      body
    },
    token
  };
  
  admin.messaging().send(message)
    .then(res => console.log("Sent:", res))
    .catch(err => console.log(err));
}