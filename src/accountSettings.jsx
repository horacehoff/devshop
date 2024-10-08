import "./accountSettings.css";
import {useEffect, useState} from "react";
import {EmailAuthProvider, getAuth, onAuthStateChanged, reauthenticateWithCredential,} from "firebase/auth";
import {auth, db, storage, user_data} from "./firebase.js";
import {useNavigate} from "react-router-dom";
import fancy_name_to_id, {interests_data, profanityFilter} from "./utility.js";
import {doc, setDoc} from "firebase/firestore";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {checkIfUsernameExists} from "./signup.jsx";
import data from "./accountSettings.json"
import i18n from "i18next";
import {useTranslation} from "react-i18next";

export default function AccountSettings() {
    i18n.addResourceBundle("en", "accsettings", data.en)
    i18n.addResourceBundle("fr", "accsettings", data.fr)
    const {t} = useTranslation("accsettings");


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

    function initInterests(interests) {
        for (let i = 0; i < interests_data.length; i++) {
            if (interests.includes(interests_data[i])) {
                document.getElementById("interest" + i).classList.add("interest-toggled");
            }
        }
    }

    const getUserData = () => {
        if (user_data) {
            console.log("USER DATA EXISTS");
            setNewUserName(user_data.username);
            setBaseUserName(user_data.username);

            if (!user_data.pfp_path) {
                console.log("NO PROFILE PICTURE - SWITCHING TO BORINGAVATARS");
                document.getElementById("profile-picture").style.backgroundImage =
                    "url('https://source.boringavatars.com/pixel/120/" +
                    baseUserName +
                    "?colors=6E00FF,0300FF,000000,FC7600,FFFFFF')";
            } else {
                console.log("PROFILE PICTURE EXISTS");
                document.getElementById("profile-picture").style.backgroundImage =
                    "url('" + user_data.pfp_path + "')";
            }

            console.log(user_data.banner_path);
            if (!user_data.banner_path) {
                console.log("NO BANNER IMAGE - SWITCHING TO BORINGAVATARS");
                document.getElementById("banner-img").style.backgroundImage =
                    "url('https://source.boringavatars.com/marble/850/" +
                    baseUserName +
                    "?square')";
            } else {
                console.log("BANNER IMAGE EXISTS");
                document.getElementById("banner-img").style.backgroundImage =
                    "url('" + user_data.banner_path + "')";
            }

            setNewBio(user_data.bio);
            setBaseBio(user_data.bio);
            setNewGithub(user_data.github || "");
        } else {
            console.log("NO USER DATA");
        }
    };

    function waitForData() {
        if (user_data) {
            getUserData();
            initInterests(user_data.interests);
        } else {
            setTimeout(waitForData, 50);
        }
    }

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("USER IS LOGGED IN");
                setUid(user.uid);
                waitForData();
            } else {
                console.log("USER IS NOT LOGGED IN");
                navigate("/sign-in");
            }
        });

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
                console.log("PFP UPLOADED")
            });
            pfpUrl = await getDownloadURL(pfpRef);
        }
        if (bannerUpload !== null && bannerUpload !== undefined) {
            let extension = bannerUpload.type.replace(/(.*)\//g, '')
            let bannerRef = ref(storage, "users/" + uid + "/" + "banner." + extension)
            await uploadBytes(bannerRef, bannerUpload).then(() => {
                console.log("BANNER UPLOADED")
            })
            bannerUrl = await getDownloadURL(bannerRef);
        }

        return [pfpUrl, bannerUrl];
    }

    const updateProfile = async () => {
        if (baseUserName !== NewUserName) {
            if (await checkIfUsernameExists(NewUserName)) {
                document.getElementById("profile-error-txt").style.display = "block";
                throw new Error("Username already exists");
            }
        }
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
                        console.log("PFP UPDATED");
                    });
                } else if (urls[0] !== "" && urls[1] !== "") {
                    const docRef = doc(db, "users", auth.currentUser.uid);
                    setDoc(docRef, {
                        pfp_path: urls[0],
                        banner_path: urls[1]
                    }, {merge: true}).then(() => {
                        console.log("PFP+BANNER UPDATED");
                    });
                } else if (urls[0] === "" && urls[1] !== "") {
                    const docRef = doc(db, "users", auth.currentUser.uid);
                    setDoc(docRef, {
                        banner_path: urls[1]
                    }, {merge: true}).then(() => {
                        console.log("BANNER UPDATED");
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
            <h1 className="title">{t('accsettings.account')}</h1>
            <h2 className="subtitle">{t('accsettings.accountsub')}</h2>
            <div id="acc-settings" className="acc-settings">
                <div className="acc-side-one">
                    <h4 className="section-title">{t('accsettings.interests')}</h4>
                    <p className="section-subtitle">{t('accsettings.interestssub')}</p>
                    <div className="interest-center">
                        {
                            interests_data.map((interest, index) => {
                                return (
                                    <div className="interest" id={"interest" + index} key={index} onClick={() => {
                                        handleInterestClick(index);
                                    }}>
                                        {interest}
                                    </div>
                                )
                            })
                        }
                        <br/>
                        <button id="interests-save-btn" className="primary save-btn"
                                onClick={async () => {
                                    let final_interests = [];
                                    let interests = document.getElementsByClassName("interest");
                                    for (let i = 0; i < interests.length; i++) {
                                        if (interests[i].classList.contains("interest-toggled")) {
                                            final_interests.push(interests[i].innerHTML);
                                        }
                                    }
                                    await updateInterests(final_interests).then(() => {
                                        document.getElementById("interests-save-btn").innerHTML = t('accsettings.saved') + " ✅";
                                        // wait 1 second
                                        setTimeout(() => {
                                            document.getElementById("interests-save-btn").innerHTML = t('accsettings.save');
                                            window.location.reload();
                                        }, 1000);
                                    })
                                }}>{t('accsettings.save')}
                        </button>
                    </div>
                    <br/><br/>
                </div>
                <div className="acc-side-two">
                    <h4 className="section-title">{t('accsettings.profile')}</h4>
                    <div className="avatar-section">
                        <input type="file" id="img-file" className="file-input" onChange={(event) => {
                            setPfpUpload(event.target.files[0])
                            document.getElementById("profile-picture").style.backgroundImage = "url('" + URL.createObjectURL(event.target.files[0]) + "')";
                        }} required accept="image/png, image/jpeg, image/jpg, image/webp"/>
                        <label className="profile-picture" id="profile-picture" htmlFor="img-file"/>
                        <div className="avatar-text">
                            AVATAR<br/><span className="avatar-size">.PNG/.JPG/.WEBP</span>
                        </div>
                        <br/>
                        <input type="file" id="banner-file" className="file-input" onChange={(event) => {
                            setBannerUpload(event.target.files[0])
                            document.getElementById("banner-img").style.backgroundImage = "url('" + URL.createObjectURL(event.target.files[0]) + "')";
                        }} required accept="image/png, image/jpeg, image/jpg, image/webp"/>
                        <label className="profile-picture" id="banner-img"
                               htmlFor="banner-file"/>
                        <div className="avatar-text">
                            {t('accsettings.banner')}<br/><span className="avatar-size">.PNG/.JPG/.WEBP</span>
                        </div>
                        <br/>
                        <div className="section-inputs">
                            <p className="profile-error-txt"
                               id="profile-error-txt">{t('accsettings.username_already_exists')}</p>
                            <p className="section-input-name">{t('accsettings.username')}</p>
                            <input type="text" className="txt-input section-input" placeholder={baseUserName}
                                   value={NewUserName} onChange={e => setNewUserName(e.target.value)}/>
                            <br/>
                            <p className="section-input-name" data-name-content="bio">{t('accsettings.bio')}</p>
                            <input type="text" className="txt-input section-input"
                                   placeholder={t('accsettings.bioplaceholder')}
                                   value={NewBio} onChange={e => setNewBio(e.target.value)}/>
                            <br/>
                            <p className="section-input-name"
                               data-name-content="github">{t('accsettings.gitusername')}</p>
                            <input type="text" className="txt-input section-input"
                                   placeholder={t('accsettings.gitplaceholder')}
                                   value={NewGithub} onChange={e => setNewGithub(e.target.value)}/>
                            <br/>
                            {/*<p className="profile-error-txt" id="profile-error-txt">// USERNAME ALREADY EXISTS</p>*/}
                            <button id="profile-save-btn" className="primary save-btn"
                                    onClick={async () => {
                                        try {
                                            await updateProfile().then(() => {
                                                document.getElementById("profile-save-btn").innerHTML = t('accsettings.saved') + " ✅";
                                                // wait 1 second
                                                setTimeout(() => {
                                                    document.getElementById("profile-save-btn").innerHTML = t('accsettings.save');
                                                    navigate("/users/" + fancy_name_to_id(user_data.username))
                                                    window.location.reload()
                                                }, 1000);
                                            })
                                        } catch (error) {
                                            setTimeout(() => {
                                                document.getElementById("profile-error-txt").style.display = "none";
                                            }, 5000);
                                        }
                                    }}>{t('accsettings.save')}
                            </button>
                        </div>
                    </div>
                    <br/><br/>
                </div>

                <h4 className="section-title pwd-section-title">{t('accsettings.password')}</h4>
                <div className="avatar-section">
                    <div className="section-inputs">
                        {/*<p className="section-input-name">OLD PASSWORD</p>*/}
                        {/*<input type="text" className="txt-input section-input" value={OldPassword}*/}
                        {/*       onChange={e => setOldPassword(e.target.value)}/>*/}
                        {/*<br/>*/}
                        {/*<p className="section-input-name">NEW PASSWORD</p>*/}
                        {/*<input type="text" className="txt-input section-input" value={NewPassword}*/}
                        {/*       onChange={e => setNewPassword(e.target.value)}/>*/}
                        {/*<br/>*/}
                        {/*<button id="pwd-save-btn" className="primary save-btn"*/}
                        {/*        onClick={async () => await updatePassword().then(() => {*/}
                        {/*            document.getElementById("pwd-save-btn").innerHTML = "SAVED ✅";*/}
                        {/*            // wait 1 second*/}
                        {/*            setTimeout(() => {*/}
                        {/*                document.getElementById("pwd-save-btn").innerHTML = "SAVE";*/}
                        {/*            }, 1500);*/}
                        {/*        })}>SAVE*/}
                        {/*</button>*/}
                        <button className="primary save-btn" onClick={() => navigate("/reset-password")}>
                            {t('accsettings.reset_password')}
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}