const AppRouter = {
  frame: document.getElementById("appFrame"),
  
  go(page) {
    this.frame.src = page;
  },
  
  home() {
    this.go("home.html");
  },
  
  reels() {
    this.go("reels.html");
  },
  
  chat() {
    this.go("chat.html");
  },
  
  notifications() {
    this.go("notifications.html");
  },
  
  story() {
    this.go("story-viewer.html");
  }
};