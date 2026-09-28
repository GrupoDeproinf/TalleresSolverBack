// firebase.js
// El .env está en la raíz del proyecto, pero PM2 arranca la API desde src/:
// sin la ruta explícita dotenv no lo encontraba y BREVO_API_KEY nunca cargaba.
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

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
  admin,
  db,
  bucket
};
