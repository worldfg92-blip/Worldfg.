function goTo(page) {
  window.location.href = page;
}

function logout() {
  firebase.auth().signOut().then(() => {
    window.location.href = "login.html";
  });
}