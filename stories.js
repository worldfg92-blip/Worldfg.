function uploadStory(file) {
  const id = Date.now();
  
  storage.ref("stories/" + id).put(file).then(snap => {
    snap.ref.getDownloadURL().then(url => {
      db.collection("stories").doc(String(id)).set({
        userId: auth.currentUser.uid,
        mediaUrl: url,
        createdAt: Date.now(),
        expiresAt: Date.now() + 86400000
      });
    });
  });
}

function getStories() {
  return db.collection("stories").get();
}