import {initializeApp} from "firebase/app";
import {getStorage} from "firebase/storage"
import {doc, getDoc, initializeFirestore} from "firebase/firestore"
import {browserLocalPersistence, indexedDBLocalPersistence, initializeAuth, onAuthStateChanged} from "firebase/auth";

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
const app = initializeApp(firebaseConfig);


console.log("init auth")
export const auth = initializeAuth(app, {
    persistence: [indexedDBLocalPersistence, browserLocalPersistence]
});

console.log("init firestore")
export const db = initializeFirestore(app, {
    experimentalForceLongPolling: true
});


console.log("init storage")
export const storage = getStorage(app);

// setLogLevel("debug");


export let user_data = null;
onAuthStateChanged(auth, async (user) => {
    if (user) {
        let docRef = doc(db, "users", user.uid);
        await getDoc(docRef).then((doc) => {
            if (doc.exists()) {
                user_data = doc.data();
                return doc.data();
            }
        });
    } else {
        return "no-user";
    }
})

export async function forceUpdate() {
    user_data = null;
    window.location.reload();
}