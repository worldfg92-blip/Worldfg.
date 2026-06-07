function register(email, password, username) {
  return auth.createUserWithEmailAndPassword(email, password)
    .then(user => {
      return db.collection("users").doc(user.user.uid).set({
        username,
        email,
        createdAt: Date.now()
      });
    });
}

function login(email, password) {
  return auth.signInWithEmailAndPassword(email, password);
}

function logout() {
  return auth.signOut();
}