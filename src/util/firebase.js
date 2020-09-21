const firebase = require("firebase-admin");
firebase.initializeApp({
  credential: firebase.credential.cert(JSON.parse(process.env.FIREBASE_AUTH))
});

module.exports = firebase.firestore();
// module.exports = {
//   database: firebase.database(),
//   storage: firebase.storage().bucket(process.env.STORAGE_BUCKET),
//   ref(location) {
//     return firebase.database().ref(location);
//   },
//   readDatabaseAt(ref, event = "value") {
//     return firebase.database().ref(ref).once(event).then(res => res).catch(e => console.log(e));
//   }
// } 
