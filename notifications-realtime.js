function listenNotifications(userId, callback) {
  
  db.collection("notifications")
    .where("userId", "==", userId)
    .onSnapshot(snapshot => {
      
      let notifications = [];
      
      snapshot.forEach(doc => {
        notifications.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      // newest first
      notifications.sort((a, b) => b.createdAt - a.createdAt);
      
      callback(notifications);
    });
}

// CREATE NOTIFICATION
function createNotification(userId, text) {
  
  db.collection("notifications").add({
    userId,
    text,
    read: false,
    createdAt: Date.now()
  });
}