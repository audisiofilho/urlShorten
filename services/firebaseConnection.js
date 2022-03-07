import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

let firebaseConfig = {
  apiKey: "AIzaSyCmlvUicox8cW0wQD-p1eBPNKv4nhgxTq0",
  authDomain: "urlshorten-860a5.firebaseapp.com",
  projectId: "urlshorten-860a5",
  storageBucket: "urlshorten-860a5.appspot.com",
  messagingSenderId: "332940048533",
  appId: "1:332940048533:web:b9391e05e7ef65c8b9c39c",
  measurementId: "G-WV8H1349E8",
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
