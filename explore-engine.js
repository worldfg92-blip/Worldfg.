async function getExploreFeed(userId) {
  let posts = [];
  
  let snapshot = await db.collection("posts").get();
  
  snapshot.forEach(doc => {
    posts.push(doc.data());
  });
  
  // remove user's own posts
  posts = posts.filter(p => p.userId !== userId);
  
  // trending score
  posts.forEach(p => {
    p.trendingScore =
      (p.likes || 0) +
      (p.comments || 0) * 2 +
      Math.random() * 10;
  });
  
  posts.sort((a, b) => b.trendingScore - a.trendingScore);
  
  return posts.slice(0, 30);
}