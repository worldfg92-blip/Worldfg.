const firebaseConfig = {
  apiKey: "AIzaSyBzByMgtpyY_l2hJc7IQQAT61Dou3u7KOE",
  authDomain: "worldfg-13c58.firebaseapp.com",
  projectId: "worldfg-13c58",
  storageBucket: "worldfg-13c58.appspot.com",
  messagingSenderId: "766593298296",
  appId: "1:766593298296:web:8e6d15700c32fe390d628d"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();


// ================= AUTH =================
function registerUser(email, password, firstName, lastName, username) {
  
  return auth.createUserWithEmailAndPassword(email, password)
    .then(async userCredential => {
      
      const user = userCredential.user;
      
      await user.sendEmailVerification();
      
      await db.collection("users").doc(user.uid).set({
        uid: user.uid,
        email: user.email,
        firstName,
        lastName,
        username,
        createdAt: Date.now()
      });
      
      return user;
      
    });
  
}

function loginUser(email, password) {
  
  return auth.signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      
      const user = userCredential.user;
      
      if (!user.emailVerified) {
        auth.signOut();
        throw new Error("EMAIL_NOT_VERIFIED");
      }
      
      return user;
      
    });
  
}

function logout() {
  return auth.signOut();
}


// ================= PROFILE =================
async function getProfile(uid) {
  
  const doc = await db.collection("users").doc(uid).get();
  
  if (!doc.exists) {
    return null;
  }
  
  return doc.data();
}


// ================= POSTS =================
function uploadPost(file, caption) {
  
  const user = auth.currentUser;
  
  const ref = storage.ref(`posts/${user.uid}/${Date.now()}_${file.name}`);
  
  return ref.put(file)
    .then(() => ref.getDownloadURL())
    .then(url => {
      
      return db.collection("posts").add({
        uid: user.uid,
        user: user.email,
        imageUrl: url,
        caption,
        likes: 0,
        createdAt: Date.now()
      });
      
    });
  
}


// ================= LIKE =================
function likePost(postId, likes) {
  return db.collection("posts").doc(postId).update({
    likes: likes + 1
  });
}


// ================= FOLLOW =================
function followUser(targetUid) {
  
  const user = auth.currentUser;
  
  return db.collection("users").doc(targetUid)
    .collection("followers").doc(user.uid)
    .set({ createdAt: Date.now() })
    .then(() => {
      
      return db.collection("users").doc(user.uid)
        .collection("following").doc(targetUid)
        .set({ createdAt: Date.now() });
      
    });
  
}

function unfollowUser(targetUid) {
  
  const user = auth.currentUser;
  
  return db.collection("users").doc(targetUid)
    .collection("followers").doc(user.uid).delete()
    .then(() => {
      
      return db.collection("users").doc(user.uid)
        .collection("following").doc(targetUid).delete();
      
    });
  
}


// ================= COMMENTS =================
function addComment(postId, text) {
  
  const user = auth.currentUser;
  
  return db.collection("posts").doc(postId)
    .collection("comments").add({
      text,
      user: user.email,
      uid: user.uid,
      createdAt: Date.now()
    });
  
}


// ================= STORIES =================
function uploadStory(file) {
  
  const user = auth.currentUser;
  
  const ref = storage.ref(`stories/${user.uid}/${Date.now()}_${file.name}`);
  
  return ref.put(file)
    .then(() => ref.getDownloadURL())
    .then(url => {
      
      return db.collection("stories").add({
        uid: user.uid,
        user: user.email,
        imageUrl: url,
        createdAt: Date.now(),
        expiresAt: Date.now() + 86400000
      });
      
    });
  
}


// ================= NOTIFICATIONS =================
function createNotification(toUid, fromUser, type, postId = null, text = null) {
  
  return db.collection("users").doc(toUid)
    .collection("notifications").add({
      type,
      fromUser,
      postId,
      text,
      read: false,
      createdAt: Date.now()
    });
  
}

function listenNotifications(uid, callback) {
  
  db.collection("users").doc(uid)
    .collection("notifications")
    .orderBy("createdAt", "desc")
    .onSnapshot(snapshot => {
      
      let list = [];
      
      snapshot.forEach(doc => {
        list.push({ id: doc.id, ...doc.data() });
      });
      
      callback(list);
      
    });
  
}