import Navbar from "./Navbar.jsx";
import "./accountSettings.css";
import {useEffect, useState} from "react";
import {EmailAuthProvider, getAuth, onAuthStateChanged, reauthenticateWithCredential,} from "firebase/auth";
import {auth, db} from "./firebase.js";
import {doc, getDoc, setDoc} from "firebase/firestore";
import {useNavigate} from "react-router-dom";


export default function AccountSettings() {
    const [NewUserName, setNewUserName] = useState("");
    const [baseUserName, setBaseUserName] = useState("");
    const [NewPassword, setNewPassword] = useState("");
    const [OldPassword, setOldPassword] = useState("");
    const [baseBio, setBaseBio] = useState("");
    const [NewBio, setNewBio] = useState("");
    const [NewGithub, setNewGithub] = useState("");
    let _uid = "";
    let state_changed = false;
    const navigate = useNavigate();


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
            setNewBio(docSnap.data().bio);
            setBaseBio(docSnap.data().bio);
            setNewGithub(docSnap.data().github);
            _uid = uid;

        } else {
            console.log("USER DOES NOT EXIST");
        }
    }

    const updateUserName = async () => {
        // if (NewUserName !== baseUserName && baseBio !== NewBio) {
            console.log(_uid);
            try {
                const docRef = doc(db, "users", auth.currentUser.uid);
                await setDoc(docRef, {
                    username: NewUserName,
                    bio: NewBio,
                    github: NewGithub
                }, {merge: true}).then(() => {
                    console.log("USERNAME UPDATED");
                });
            } catch (e) {
                console.error("ERROR UPDATING USERNAME: ", e);
            }
        // }
    }

    const updatePassword = async () => {
        const auth = getAuth();
        const credential = EmailAuthProvider.credential(
            auth.currentUser.email,
            OldPassword
        )
        const result = await reauthenticateWithCredential(
            auth.currentUser,
            credential
        ).catch((error) => {
            console.log(error);
        });
        if (result) {
            const user = auth.currentUser;
            console.log("REAUTHENTICATED");
            updatePassword(user, NewPassword).then(() => {
                console.log("PASSWORD UPDATED");
            });
        }
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
                        <p className="section-input-name" data-name-content="bio">BIO</p>
                        <input type="text" className="txt-input section-input" placeholder="Hi, I'm new to DEVSHOP!"
                               value={NewBio} onChange={e => setNewBio(e.target.value)}/>
                        <br/>
                        <p className="section-input-name" data-name-content="github">GITHUB USERNAME</p>
                        <input type="text" className="txt-input section-input" placeholder="your-github-username"
                               value={NewGithub} onChange={e => setNewGithub(e.target.value)}/>
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
                <h4 className="section-title">PASSWORD(WIP)</h4>
                <div className="avatar-section">
                    <div className="section-inputs">
                        <p className="section-input-name">OLD PASSWORD</p>
                        <input type="text" className="txt-input section-input" value={OldPassword}
                               onChange={e => setOldPassword(e.target.value)}/>
                        <br/>
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