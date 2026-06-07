function calculateScore(post, user) {
  let engagement =
    (post.likes || 0) * 3 +
    (post.comments || 0) * 5 +
    (post.shares || 0) * 6;
  
  let recency = Date.now() - post.createdAt;
  let timeBoost = 1 / (recency / 1000000);
  
  let authorBoost = post.userId === user.id ? 1.5 : 1;
  
  return engagement * authorBoost + timeBoost;
}

async function getFeed(user) {
  let posts = [];
  
  let snapshot = await db.collection("posts").get();
  
  snapshot.forEach(doc => {
    posts.push({ id: doc.id, ...doc.data() });
  });
  
  posts.forEach(p => {
    p.score = calculateScore(p, user);
  });
  
  posts.sort((a, b) => b.score - a.score);
  
  return posts.slice(0, 50);
}