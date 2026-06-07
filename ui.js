function likeButton(el) {
  el.style.transform = "scale(1.3)";
  setTimeout(() => el.style.transform = "scale(1)", 150);
}

function openStory() {
  window.location.href = "story-viewer.html";
}

function go(page) {
  window.location.href = page;
}