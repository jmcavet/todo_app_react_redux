
/*
import firebase from 'firebase/app';
import 'firebase/firestore'
import 'firebase/auth'
*/
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';


// Initialize firebase
var config = {
    apiKey: "AIzaSyC7I14xMpmaAxjAJOod4GHyR6Xott_6dEM",
    authDomain: "react-redux-todo-app-ba25e.firebaseapp.com",
    projectId: "react-redux-todo-app-ba25e",
    storageBucket: "react-redux-todo-app-ba25e.appspot.com",
    messagingSenderId: "1083623021572",
    appId: "1:1083623021572:web:4ab8a0919f68e003e9e951",
    measurementId: "G-19J3Q8618P",
};

firebase.initializeApp(config);
firebase.firestore().settings({ timestampInSnapshots: true })

export default firebase;