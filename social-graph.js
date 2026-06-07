function followUser(followerId, followingId) {
  return db.collection("follows").add({
    followerId,
    followingId,
    createdAt: Date.now()
  });
}

function unfollowUser(followerId, followingId) {
  db.collection("follows")
    .where("followerId", "==", followerId)
    .where("followingId", "==", followingId)
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        db.collection("follows").doc(doc.id).delete();
      });
    });
}

function getFollowing(userId) {
  return db.collection("follows")
    .where("followerId", "==", userId)
    .get()
    .then(snapshot => {
      let list = [];
      snapshot.forEach(doc => list.push(doc.data().followingId));
      return list;
    });
}