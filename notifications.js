function notify(userId, text) {
  db.collection("notifications").add({
    userId,
    text,
    read: false,
    createdAt: Date.now()
  });
}

function listenNotifications(userId, cb) {
  db.collection("notifications")
    .where("userId", "==", userId)
    .onSnapshot(snap => {
      let arr = [];
      snap.forEach(d => arr.push(d.data()));
      cb(arr);
    });
}