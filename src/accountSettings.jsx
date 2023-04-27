import Navbar from "./Navbar.jsx";
import "./accountSettings.css";
import {useEffect, useState} from "react";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {auth, db} from "./firebase.js";
import {doc, getDoc, setDoc} from "firebase/firestore";
import {useNavigate} from "react-router-dom";


export default function AccountSettings() {
    const [NewUserName, setNewUserName] = useState("");
    const [baseUserName, setBaseUserName] = useState("");
    const [NewPassword, setNewPassword] = useState("")
    let _uid = "";
    let state_changed = false;


    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user && !state_changed) {
                state_changed = true;
                console.log("USER IS LOGGED IN");
                getData(user.uid, user.email).then(() => {
                    console.log("DATA LOADED");
                });
            } else {
                console.log("USER IS NOT LOGGED IN");
                const navigate = useNavigate();
                navigate("/sign-in");
            }
        });
    }, []);

    const getData = async (uid) => {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            setNewUserName(docSnap.data().username);
            setBaseUserName(docSnap.data().username);
            _uid = uid;

        } else {
            console.log("USER DOES NOT EXIST");
        }
    }

    const updateUserName = async () => {
        if (NewUserName !== baseUserName) {
            console.log(_uid);
            try {
                const docRef = doc(db, "users", auth.currentUser.uid);
                await setDoc(docRef, {
                    username: NewUserName,
                }, {merge: true}).then(() => {
                    console.log("USERNAME UPDATED");
                });
            } catch (e) {
                console.error("ERROR UPDATING USERNAME: ", e);
            }
        }
    }

    const updatePassword = async () => {
        const auth = getAuth();
        const user = auth.currentUser;

        updatePassword(user, NewPassword).then(() => {
            console.log("PASSWORD UPDATED")
        }).catch((error) => {
            console.log(error)
        })
    }

    return (
        <>
            <Navbar/>
            <h1 className="title">ACCOUNT</h1>
            <h2 className="subtitle">MODIFY YOUR ACCOUNT SETTINGS BELOW</h2>
            <div id="acc-settings">
                <h4 className="section-title">PROFILE</h4>
                <div className="avatar-section">
                    <img className="profile-picture" src="https://i.imgur.com/0X0X0X0.png" alt="profile picture"/>
                    <div className="avatar-text">
                        AVATAR<br/><span className="avatar-size">MIN. 60x60PX</span>
                    </div>
                    <br/>
                    <div className="section-inputs">
                        <p className="section-input-name">USERNAME</p>
                        <input type="text" className="txt-input section-input" placeholder={baseUserName}
                               value={NewUserName} onChange={e => setNewUserName(e.target.value)}/>
                        <br/>
                        <button id="profile-save-btn" className="btn-primary save-btn"
                                onClick={async () => await updateUserName().then(() => {
                                    document.getElementById("profile-save-btn").innerHTML = "SAVED ✅";
                                    // wait 1 second
                                    setTimeout(() => {
                                        document.getElementById("profile-save-btn").innerHTML = "SAVE";
                                    }, 1500);
                                })}>SAVE
                        </button>
                    </div>
                </div>
                <br/><br/>
                <h4 className="section-title">PASSWORD</h4>
                <div className="avatar-section">
                    <div className="section-inputs">
                        <p className="section-input-name">NEW PASSWORD</p>
                        <input type="text" className="txt-input section-input" value={NewPassword}
                               onChange={e => setNewPassword(e.target.value)}/>
                        <br/>
                        <button id="profile-save-btn" className="btn-primary save-btn"
                                onClick={async () => await updatePassword().then(() => {
                                    document.getElementById("profile-save-btn").innerHTML = "SAVED ✅";
                                    // wait 1 second
                                    setTimeout(() => {
                                        document.getElementById("profile-save-btn").innerHTML = "SAVE";
                                    }, 1500);
                                })}>SAVE
                        </button>
                    </div>

                </div>
            </div>
        </>
    )
}