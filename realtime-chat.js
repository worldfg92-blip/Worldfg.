function sendMessage(toUserId, text) {
  db.collection("messages").add({
    from: auth.currentUser.uid,
    to: toUserId,
    text,
    seen: false,
    createdAt: Date.now()
  });
}

function listenMessages(userId, callback) {
  db.collection("messages")
    .orderBy("createdAt")
    .onSnapshot(snapshot => {
      let msgs = [];
      snapshot.forEach(doc => {
        let m = doc.data();
        if (
          (m.from === userId && m.to === auth.currentUser.uid) ||
          (m.to === userId && m.from === auth.currentUser.uid)
        ) {
          msgs.push(m);
        }
      });
      callback(msgs);
    });
}