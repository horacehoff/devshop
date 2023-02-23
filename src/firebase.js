// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore"
import {browserLocalPersistence, indexedDBLocalPersistence, initializeAuth} from "firebase/auth";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBOldJ0-VRG2xuEQ-ErjDVlb1ObZcSgTPw",
    authDomain: "devshop-data.firebaseapp.com",
    projectId: "devshop-data",
    storageBucket: "devshop-data.appspot.com",
    messagingSenderId: "91319198237",
    appId: "1:91319198237:web:ef3548c24721c2e05e9cf4",
    measurementId: "G-708JQM44KP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = initializeAuth(app, {
    persistence: [indexedDBLocalPersistence, browserLocalPersistence]
});