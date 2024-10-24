"use strict";

require('dotenv').config();
var _require = require("firebase-admin/app"),
  initializeApp = _require.initializeApp,
  applicationDefault = _require.applicationDefault;
var _require2 = require("firebase-admin/firestore"),
  getFirestore = _require2.getFirestore;
initializeApp({
  credential: applicationDefault()
});
var db = getFirestore();
module.exports = {
  db: db
};