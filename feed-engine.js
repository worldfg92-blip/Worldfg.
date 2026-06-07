function getFeed() {
  return db.collection("posts").get().then(snapshot => {
    let posts = [];
    
    snapshot.forEach(doc => {
      posts.push({ id: doc.id, ...doc.data() });
    });
    
    posts.forEach(p => {
      p.score =
        (p.likesCount || 0) * 3 +
        (p.commentsCount || 0) * 5 +
        (Date.now() - p.createdAt) / 1000000;
    });
    
    posts.sort((a, b) => b.score - a.score);
    
    return posts;
  });
}