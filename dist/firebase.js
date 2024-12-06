"use strict";

// firebase.js
require('dotenv').config();
var _require = require("firebase-admin/app"),
  initializeApp = _require.initializeApp,
  applicationDefault = _require.applicationDefault;
var _require2 = require("firebase-admin/firestore"),
  getFirestore = _require2.getFirestore;
var _require3 = require("firebase-admin/storage"),
  getStorage = _require3.getStorage;
var admin = require('firebase-admin');
var serviceAccount = require('../firebase.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://talleres-solvers-app.firebasestorage.app"
});
var db = getFirestore();
var bucket = getStorage().bucket();
module.exports = {
  db: db,
  bucket: bucket
};