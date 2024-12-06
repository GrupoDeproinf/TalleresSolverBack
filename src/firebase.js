// firebase.js
require('dotenv').config();

const { initializeApp, applicationDefault } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getStorage } = require("firebase-admin/storage");
const admin = require('firebase-admin');
const serviceAccount = require('../firebase.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://talleres-solvers-app.firebasestorage.app"
});

const db = getFirestore();
const bucket = getStorage().bucket();

module.exports = {
  db,
  bucket
};
