function setOnline(userId) {
  db.collection("presence").doc(userId).set({
    online: true,
    lastSeen: Date.now()
  });
}

function setOffline(userId) {
  db.collection("presence").doc(userId).update({
    online: false,
    lastSeen: Date.now()
  });
}

function listenPresence(userId, callback) {
  db.collection("presence").doc(userId)
    .onSnapshot(doc => {
      callback(doc.data());
    });
}