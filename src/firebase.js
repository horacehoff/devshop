import {initializeApp} from "firebase/app";
import {getStorage} from "firebase/storage"
import {getFirestore} from "firebase/firestore"
import {browserLocalPersistence, initializeAuth} from "firebase/auth";

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

export const storage = getStorage(app);
export const db = getFirestore();
export const auth = initializeAuth(app, {
    persistence: [browserLocalPersistence]
});