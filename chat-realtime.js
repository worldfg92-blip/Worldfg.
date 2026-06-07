function listenChat(userA, userB, callback) {
  
  db.collection("messages")
    .orderBy("createdAt")
    .onSnapshot(snapshot => {
      
      let messages = [];
      
      snapshot.forEach(doc => {
        let m = doc.data();
        
        if (
          (m.from === userA && m.to === userB) ||
          (m.from === userB && m.to === userA)
        ) {
          messages.push(m);
        }
      });
      
      callback(messages);
    });
}

// SEND MESSAGE
function sendMessage(from, to, text) {
  
  db.collection("messages").add({
    from,
    to,
    text,
    seen: false,
    createdAt: Date.now()
  });
}