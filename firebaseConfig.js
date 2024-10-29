// firebaseConfig.js
const { initializeApp } = require("firebase/app");

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB7JeVA4YZBzTblEOnZ-drNT-vwv085fgM",
  authDomain: "talleres-solvers-app.firebaseapp.com",
  projectId: "talleres-solvers-app",
  storageBucket: "talleres-solvers-app.appspot.com",
  messagingSenderId: "144076824848",
  appId: "1:144076824848:web:cdaf60b28136561b338595",
  measurementId: "G-DXQ986SLJR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Export the app and firebaseConfig
module.exports = { app, firebaseConfig };
