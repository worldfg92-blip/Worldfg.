function sendChat(toUserId, text) {
  var from = getCurrentUser().id;
  
  sendMessage(from, toUserId, text);
}