function getReels() {
  return WorldFG.posts.filter(p => p.mediaType === "video");
}