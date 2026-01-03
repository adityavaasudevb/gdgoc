import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "gdgoc-campus-platform.firebaseapp.com",
  projectId: "gdgoc-campus-platform",
  storageBucket: "gdgoc-campus-platform.firebasestorage.app",
  messagingSenderId: "1092384495710",
  appId: "1:1092384495710:web:412154398a4392aef0bccf",
};

const app = initializeApp(firebaseConfig);

export default app;
