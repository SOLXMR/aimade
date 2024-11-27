import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAE6wxk9aEv1zHvh9nbquB53Or1fCcKHKY",
  authDomain: "aimadefun.firebaseapp.com",
  databaseURL: "https://aimadefun-default-rtdb.firebaseio.com",
  projectId: "aimadefun",
  storageBucket: "aimadefun.firebasestorage.app",
  messagingSenderId: "949018441598",
  appId: "1:949018441598:web:6452bbc8d708231e1c652f",
  measurementId: "G-DJXVT0ZFLQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db, analytics }; 