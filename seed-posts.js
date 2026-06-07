function seedPosts(){

  const posts = [
    {
      user: "WorldFG",
      imageUrl: "https://picsum.photos/500",
      caption: "Welcome to WorldFG 🚀",
      likes: 0,
      createdAt: Date.now()
    },
    {
      user: "Admin",
      imageUrl: "https://picsum.photos/501",
      caption: "First test post 🔥",
      likes: 0,
      createdAt: Date.now()
    }
  ];

  posts.forEach(p => {
    firebase.firestore().collection("posts").add(p);
  });

  console.log("Seeded posts successfully!");
}