require('dotenv').config()

const {initializeApp , applicationDefault} = require("firebase-admin/app")
const {getFirestore} = require("firebase-admin/firestore")
const admin = require('firebase-admin');
const serviceAccount = require('../firebase.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = getFirestore()

module.exports={
    db
}