import firebase from 'firebase';

let firebaseConfig = {
    apiKey: "AIzaSyBcSB80hnefgqqeRRLKWAs0di9i71cjL-U",
    authDomain: "sysgi-210bd.firebaseapp.com",
    databaseURL: "https://sysgi-210bd.firebaseio.com",
    projectId: "sysgi-210bd",
    storageBucket: "sysgi-210bd.appspot.com",
    messagingSenderId: "636966878050",
    appId: "1:636966878050:web:09fb8285a0b4c1b9938a3b",
    measurementId: "G-807DSCTC0E"
  };
firebase.initializeApp(firebaseConfig);

export default firebase;