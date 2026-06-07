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
    .then(async user => {
      
      await user.user.sendEmailVerification();
      
      await db.collection("users").doc(user.user.uid).set({
        uid: user.user.uid,
        email,
        firstName,
        lastName,
        username,
        createdAt: Date.now()
      });
      
    });
  
}

function loginUser(email, password) {
  
  return auth.signInWithEmailAndPassword(email, password)
    .then(user => {
      
      if (!user.user.emailVerified) {
        auth.signOut();
        throw new Error("EMAIL_NOT_VERIFIED");
      }
      
    });
  
}


// ================= PROFILE =================
function getProfile(uid) {
  return db.collection("users").doc(uid).get()
    .then(doc => doc.exists ? doc.data() : null);
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

function listenStories(callback) {
  
  db.collection("stories")
    .orderBy("createdAt", "desc")
    .onSnapshot(snapshot => {
      
      let list = [];
      const now = Date.now();
      
      snapshot.forEach(doc => {
        let s = doc.data();
        if (s.expiresAt > now) {
          list.push({ id: doc.id, ...s });
        }
      });
      
      callback(list);
    });
  
}


// ================= REELS =================
function uploadReel(file, caption) {
  
  const user = auth.currentUser;
  
  const ref = storage.ref(`reels/${user.uid}/${Date.now()}_${file.name}`);
  
  return ref.put(file)
    .then(() => ref.getDownloadURL())
    .then(url => {
      
      return db.collection("reels").add({
        uid: user.uid,
        user: user.email,
        videoUrl: url,
        caption,
        createdAt: Date.now()
      });
      
    });
  
}

function listenReels(callback) {
  
  db.collection("reels")
    .orderBy("createdAt", "desc")
    .onSnapshot(snapshot => {
      
      let list = [];
      
      snapshot.forEach(doc => {
        list.push({ id: doc.id, ...doc.data() });
      });
      
      callback(list);
    });
  
}


// ================= CHAT =================
function getChatId(a, b) {
  return [a, b].sort().join("_");
}

function sendMessage(receiverUid, text) {
  
  const sender = auth.currentUser;
  const chatId = getChatId(sender.uid, receiverUid);
  
  return db.collection("chats")
    .doc(chatId)
    .collection("messages")
    .add({
      senderUid: sender.uid,
      receiverUid,
      text,
      createdAt: Date.now()
    });
  
}

function listenMessages(otherUid, callback) {
  
  const user = auth.currentUser;
  const chatId = getChatId(user.uid, otherUid);
  
  db.collection("chats")
    .doc(chatId)
    .collection("messages")
    .orderBy("createdAt", "asc")
    .onSnapshot(snapshot => {
      
      let list = [];
      
      snapshot.forEach(doc => {
        list.push({ id: doc.id, ...doc.data() });
      });
      
      callback(list);
    });
  
}


// ================= SEARCH =================
function searchUsers(query, callback) {
  
  db.collection("users").get().then(snapshot => {
    
    let results = [];
    
    snapshot.forEach(doc => {
      
      let u = doc.data();
      
      if (
        u.username?.toLowerCase().includes(query.toLowerCase()) ||
        u.email?.toLowerCase().includes(query.toLowerCase())
      ) {
        results.push(u);
      }
      
    });
    
    callback(results);
    
  });
  
}


// ================= AI FEED =================
function loadAIFeed(callback) {
  
  db.collection("posts").get().then(snapshot => {
    
    let posts = [];
    
    snapshot.forEach(doc => {
      
      let p = doc.data();
      
      let score =
        (p.likes || 0) * 3 +
        (Date.now() - p.createdAt) * -0.000001 +
        Math.random() * 2;
      
      posts.push({
        id: doc.id,
        ...p,
        score
      });
      
    });
    
    posts.sort((a, b) => b.score - a.score);
    
    callback(posts);
    
  });
  
}