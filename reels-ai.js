function getReelsFeed(userId) {
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
          (r.likes || 0) * 4 +
          (r.comments || 0) * 3 +
          Math.random() * 5;
      });
      
      reels.sort((a, b) => b.score - a.score);
      
      return reels;
    });
}