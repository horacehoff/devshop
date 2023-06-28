import Navbar from "./Navbar.jsx";
import "./accountSettings.css";
import {useEffect, useState} from "react";
import {EmailAuthProvider, getAuth, onAuthStateChanged, reauthenticateWithCredential,} from "firebase/auth";
import {auth, db, storage, user_data} from "./firebase.js";
import {useNavigate} from "react-router-dom";
import fancy_name_to_id, {interests_data, profanityFilter} from "./utility.js";
import {doc, setDoc} from "firebase/firestore";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";

export default function AccountSettings() {
    const [NewUserName, setNewUserName] = useState("");
    const [baseUserName, setBaseUserName] = useState("");
    const [NewPassword, setNewPassword] = useState("");
    const [OldPassword, setOldPassword] = useState("");
    const [baseBio, setBaseBio] = useState("");
    const [NewBio, setNewBio] = useState("");
    const [NewGithub, setNewGithub] = useState("");
    const [pfpUpload, setPfpUpload] = useState(null);
    const [bannerUpload, setBannerUpload] = useState(null);
    const [uid, setUid] = useState("");
    const navigate = useNavigate();

    function preInterests(interests) {
        for (let i = 0; i < interests_data.length; i++) {
            if (interests.includes(interests_data[i])) {
                document.getElementById("interest" + i).classList.add("interest-toggled");
            }
        }
    }

    const getUserData = () => {
        if (user_data) {
            setNewUserName(user_data.username);
            setBaseUserName(user_data.username);

            if (!user_data.pfp_path) {
                console.log("No profile picture");
                document.getElementById("profile-picture").style.backgroundImage =
                    "url('https://source.boringavatars.com/pixel/120/" +
                    baseUserName +
                    "?colors=6E00FF,0300FF,000000,FC7600,FFFFFF')";
            } else {
                console.log("Profile picture");
                document.getElementById("profile-picture").style.backgroundImage =
                    "url('" + user_data.pfp_path + "')";
            }

            console.log(user_data.banner_path);
            if (!user_data.banner_path) {
                console.log("No banner image");
                document.getElementById("banner-img").style.backgroundImage =
                    "url('https://source.boringavatars.com/marble/850/" +
                    baseUserName +
                    "?square')";
            } else {
                console.log("Banner image");
                document.getElementById("banner-img").style.backgroundImage =
                    "url('" + user_data.banner_path + "')";
            }

            setNewBio(user_data.bio);
            setBaseBio(user_data.bio);
            setNewGithub(user_data.github || "");
        } else {
            console.log("No user data found");
        }
    };

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("USER IS LOGGED IN");
                setUid(user.uid);
            } else {
                console.log("USER IS NOT LOGGED IN");
                navigate("/sign-in");
            }
        });
    }, []);

    useEffect(() => {
        if (user_data) {
            getUserData();
            preInterests(user_data.interests);
        }
    }, [user_data]);

    const updateAccount = async () => {
        const docRef = doc(db, "users", auth.currentUser.uid);
        await setDoc(docRef, {
            username: fancy_name_to_id(profanityFilter(NewUserName)),
            bio: profanityFilter(NewBio),
            github: NewGithub
        }, {merge: true}).then(() => {
            console.log("USERNAME UPDATED");
        });
    }

    const uploadImg = async () => {
        let pfpUrl = "";
        let bannerUrl = "";
        if (pfpUpload !== null && pfpUpload !== undefined) {
            let extension = pfpUpload.type.replace(/(.*)\//g, '')
            let pfpRef = ref(storage, "users/" + uid + "/" + "pfp." + extension)
            await uploadBytes(pfpRef, pfpUpload).then(() => {
                console.log("pfp uploaded")
            });
            pfpUrl = await getDownloadURL(pfpRef);
        }
        if (bannerUpload !== null && bannerUpload !== undefined) {
            let extension = bannerUpload.type.replace(/(.*)\//g, '')
            let bannerRef = ref(storage, "users/" + uid + "/" + "banner." + extension)
            await uploadBytes(bannerRef, bannerUpload).then(() => {
                console.log("banner uploaded")
            })
            bannerUrl = await getDownloadURL(bannerRef);
        }

        return [pfpUrl, bannerUrl];
    }

    const updateProfile = async () => {
        if (NewBio !== baseBio || NewGithub !== "" || NewUserName !== baseUserName) {
            console.log("PROFILE UPDATED")
            await updateAccount()
        }
        if (pfpUpload || bannerUpload) {
            await uploadImg().then((urls) => {
                if (urls[0] !== "" && urls[1] === "") {
                    const docRef = doc(db, "users", auth.currentUser.uid);
                    setDoc(docRef, {
                        pfp_path: urls[0]
                    }, {merge: true}).then(() => {
                        console.log("pfp user updated");
                    });
                } else if (urls[0] !== "" && urls[1] !== "") {
                    const docRef = doc(db, "users", auth.currentUser.uid);
                    setDoc(docRef, {
                        pfp_path: urls[0],
                        banner_path: urls[1]
                    }, {merge: true}).then(() => {
                        console.log("pfp and banner user updated");
                    });
                } else if (urls[0] === "" && urls[1] !== "") {
                    const docRef = doc(db, "users", auth.currentUser.uid);
                    setDoc(docRef, {
                        banner_path: urls[1]
                    }, {merge: true}).then(() => {
                        console.log("banner user updated");
                    });
                }
            })

        }

    }


    // NEEDS FIX !! => maybe just send reset password email
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

    const handleInterestClick = (index) => {
        if (document.getElementById("interest" + index).classList.contains("interest-toggled")) {
            document.getElementById("interest" + index).classList.remove("interest-toggled");
        } else {
            document.getElementById("interest" + index).classList.add("interest-toggled");
        }
    }

    const updateInterests = async (new_interests) => {
        const docRef = doc(db, "users", auth.currentUser.uid);
        await setDoc(docRef, {
            interests: new_interests
        }, {merge: true}).then(() => {
            console.log("INTERESTS UPDATED");
        });
    }

    return (
        <>
            <Navbar/>
            <h1 className="title">ACCOUNT</h1>
            <h2 className="subtitle">MODIFY YOUR ACCOUNT SETTINGS BELOW</h2>
            <div id="acc-settings">
                <h4 className="section-title">INTERESTS</h4>
                <p className="section-subtitle">What do you like ?</p>
                <div className="interest-center">
                    {
                        interests_data.map((interest, index) => {
                            return (
                                <div className="interest" id={"interest" + index} onClick={() => {
                                    handleInterestClick(index);
                                }}>
                                    {interest}
                                </div>
                            )
                        })
                    }
                    <br/>
                    <button id="interests-save-btn" className="btn-primary save-btn"
                            onClick={async () => {
                                let final_interests = [];
                                let interests = document.getElementsByClassName("interest");
                                for (let i = 0; i < interests.length; i++) {
                                    if (interests[i].classList.contains("interest-toggled")) {
                                        final_interests.push(interests[i].innerHTML);
                                    }
                                }
                                await updateInterests(final_interests).then(() => {
                                    document.getElementById("interests-save-btn").innerHTML = "SAVED ✅";
                                    // wait 1 second
                                    setTimeout(() => {
                                        document.getElementById("interests-save-btn").innerHTML = "SAVE";
                                        window.location.reload();
                                    }, 1000);
                                })
                            }}>SAVE
                    </button>
                </div>

                <br/><br/>
                <h4 className="section-title">PROFILE</h4>
                <div className="avatar-section">
                    <input type="file" id="img-file" style={{display: "none"}} onChange={(event) => {
                        setPfpUpload(event.target.files[0])
                        document.getElementById("profile-picture").style.backgroundImage = "url('" + URL.createObjectURL(event.target.files[0]) + "')";
                    }} required accept="image/png, image/jpeg, image/jpg, image/webp"/>
                    <label className="profile-picture" id="profile-picture" htmlFor="img-file"/>
                    <div className="avatar-text">
                        AVATAR<br/><span className="avatar-size">.PNG/.JPG/.WEBP</span>
                    </div>
                    <br/>
                    <input type="file" id="banner-file" style={{display: "none"}} onChange={(event) => {
                        setBannerUpload(event.target.files[0])
                        document.getElementById("banner-img").style.backgroundImage = "url('" + URL.createObjectURL(event.target.files[0]) + "')";
                    }} required accept="image/png, image/jpeg, image/jpg, image/webp"/>
                    <label className="profile-picture" style={{width: "100px", borderRadius: "6px"}} id="banner-img"
                           htmlFor="banner-file"/>
                    <div className="avatar-text">
                        BANNER<br/><span className="avatar-size">.PNG/.JPG/.WEBP</span>
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
                                onClick={async () => await updateProfile().then(() => {
                                    document.getElementById("profile-save-btn").innerHTML = "SAVED ✅";
                                    // wait 1 second
                                    setTimeout(() => {
                                        document.getElementById("profile-save-btn").innerHTML = "SAVE";
                                        window.location.reload();
                                    }, 1000);
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
                        <button id="pwd-save-btn" className="btn-primary save-btn"
                                onClick={async () => await updatePassword().then(() => {
                                    document.getElementById("pwd-save-btn").innerHTML = "SAVED ✅";
                                    // wait 1 second
                                    setTimeout(() => {
                                        document.getElementById("pwd-save-btn").innerHTML = "SAVE";
                                    }, 1500);
                                })}>SAVE
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}