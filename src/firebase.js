import {initializeApp} from "firebase/app";
import {getStorage} from "firebase/storage"
import {getFirestore, setLogLevel} from "firebase/firestore"
import {browserLocalPersistence, indexedDBLocalPersistence, initializeAuth} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBOldJ0-VRG2xuEQ-ErjDVlb1ObZcSgTPw",
    authDomain: "devshop-data.firebaseapp.com",
    projectId: "devshop-data",
    storageBucket: "devshop-data.appspot.com",
    messagingSenderId: "91319198237",
    appId: "1:91319198237:web:ef3548c24721c2e05e9cf4",
    measurementId: "G-708JQM44KP"
};

console.log("init app")
// Initialize Firebase
const app = initializeApp(firebaseConfig);

console.log("init storage")
export const storage = getStorage(app);
console.log("init firestore")
export const db = getFirestore();
setLogLevel("debug");
console.log("init auth")
export const auth = initializeAuth(app, {
    persistence: [indexedDBLocalPersistence, browserLocalPersistence]
});