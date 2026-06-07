function verifyUser(userId) {
  db.collection("users").doc(userId).update({
    verified: true
  });
}

function isVerified(user) {
  return user && user.verified === true;
}