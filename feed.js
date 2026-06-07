import { db } from "./firebase.js";
import {
  collection,
  onSnapshot,
  query,
  orderBy
} from "firebase/firestore";

export function loadFeed(callback) {
  const q = query(collection(db, "posts"), orderBy("time", "desc"));
  
  onSnapshot(q, (snap) => {
    let posts = [];
    snap.forEach(doc => posts.push(doc.data()));
    
    // SIMPLE RANKING ALGORITHM (Instagram-like)
    posts.sort((a, b) => {
      let scoreA = (a.likes || 0) + (a.comments || 0);
      let scoreB = (b.likes || 0) + (b.comments || 0);
      return scoreB - scoreA;
    });
    
    callback(posts);
  });
}