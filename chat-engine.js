function sendMessage(to, text) {
  db.collection("messages").add({
    from: auth.currentUser.uid,
    to,
    text,
    seen: false,
    createdAt: Date.now()
  });
}

function listenChat(userA, userB, cb) {
  db.collection("messages")
    .orderBy("createdAt")
    .onSnapshot(snap => {
      let msgs = [];
      
      snap.forEach(doc => {
        let m = doc.data();
        if (
          (m.from === userA && m.to === userB) ||
          (m.from === userB && m.to === userA)
        ) {
          msgs.push(m);
        }
      });
      
      cb(msgs);
    });
}