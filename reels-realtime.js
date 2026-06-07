function listenReels(callback) {
  
  db.collection("posts")
    .where("mediaType", "==", "video")
    .onSnapshot(snapshot => {
      
      let reels = [];
      
      snapshot.forEach(doc => {
        reels.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      // REELS VIRAL SCORE
      reels.forEach(r => {
        r.score =
          (r.likesCount || 0) * 4 +
          (r.commentsCount || 0) * 3 +
          Math.random() * 10;
      });
      
      reels.sort((a, b) => b.score - a.score);
      
      callback(reels);
    });
}