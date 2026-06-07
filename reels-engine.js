function getReels() {
  return db.collection("posts")
    .where("mediaType", "==", "video")
    .get()
    .then(snapshot => {
      let reels = [];
      
      snapshot.forEach(doc => {
        reels.push(doc.data());
      });
      
      reels.forEach(r => {
        r.score =
          (r.likesCount || 0) * 4 +
          (r.commentsCount || 0) * 3 +
          Math.random() * 10;
      });
      
      reels.sort((a, b) => b.score - a.score);
      
      return reels;
    });
}