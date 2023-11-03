import "./createPackage.css"
import "./createSnippet.css"
import {useState} from "react";
import {auth, db, storage, user_data} from "./firebase.js";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage"
import {onAuthStateChanged} from "firebase/auth";
import {useNavigate} from "react-router-dom";
import {doc, getDoc, setDoc} from "firebase/firestore";
import fancy_name_to_id, {generateUUID, interests_data, profanityFilter} from "./utility.js";
import MDEditor from '@uiw/react-md-editor';
import {BiCloudUpload} from "react-icons/bi";
import SnippetCard from "./snippetCard.jsx";
import Popup from "reactjs-popup";
import i18n from "i18next";
import data from "./createSnippet.json";
import card from "./packageSnippetCard.json"
import {useTranslation} from "react-i18next";

export default function CreateSnippet() {
    i18n.addResourceBundle("en", "createsnippet", data.en)
    i18n.addResourceBundle("en", "createsnippet", card.en)
    i18n.addResourceBundle("fr", "createsnippet", data.fr)
    i18n.addResourceBundle("fr", "createsnippet", card.fr)
    const {t} = useTranslation("createsnippet");


    const [imgUpload0ne, setImgUploadOne] = useState(null);

    const [imgUploadTwo, setImgUploadTwo] = useState(null);

    const [imgUploadThree, setImgUploadThree] = useState(null);

    const [imgUploadFour, setImgUploadFour] = useState(null);

    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [version, setVersion] = useState("");
    const [longDesc, setLongDesc] = useState("**" + t('createsnippet.descholder') + "**");
    const [code, setCode] = useState("");
    let codeblock_id = "";

    const [warning, setWarning] = useState(false);
    const [missingFields, setMissingFields] = useState(false);
    const [missingUploads, setMissingUploads] = useState(false);

    let uid = "";
    const navigate = useNavigate()
    onAuthStateChanged(auth, (user) => {
        if (user) {
            uid = user.uid;
        } else {
            setWarning(true)
        }
    });
    const upload = async () => {
        let name_id = generateUUID(fancy_name_to_id(name))
        codeblock_id = name_id;

        let imgRefOne = ref(storage, "users/" + uid + "/snippets/" + name_id + "/img/one/" + (imgUpload0ne.name ?? ("screenone" + imgUpload0ne.type)))
        await uploadBytes(imgRefOne, imgUpload0ne).then(() => {
            document.getElementById("publish-btn").innerHTML = t('createsnippet.uploading') + "... => ███▒▒▒▒▒▒▒▒▒▒▒ 21%"
        })

        let imgRefTwo = ref(storage, "users/" + uid + "/snippets/" + name_id + "/img/two/" + imgUploadTwo.name ?? ("screentwo" + imgUpload0ne.type))
        await uploadBytes(imgRefTwo, imgUploadTwo).then(() => {
            document.getElementById("publish-btn").innerHTML = t('createsnippet.uploading') + "... => ████▒▒▒▒▒▒▒▒▒▒ 28%"
        })

        let imgRefThree = ref(storage, "users/" + uid + "/snippets/" + name_id + "/img/three/" + imgUploadThree.name ?? ("screenthree" + imgUpload0ne.type))
        await uploadBytes(imgRefThree, imgUploadThree).then(() => {
            document.getElementById("publish-btn").innerHTML = t('createsnippet.uploading') + "... => █████▒▒▒▒▒▒▒▒▒ 35%"
        })

        let imgRefFour = ref(storage, "users/" + uid + "/snippets/" + name_id + "/img/four/" + imgUploadFour.name ?? ("screenfour" + imgUpload0ne.type))
        await uploadBytes(imgRefFour, imgUploadFour).then(() => {
            document.getElementById("publish-btn").innerHTML = t('createsnippet.uploading') + "... => ██████▒▒▒▒▒▒▒▒ 42%"
        })

        document.getElementById("publish-btn").innerHTML = t('createsnippet.uploading') + "... => ███████▒▒▒▒▒▒▒ 49%"
        let screenOneUrl = await getDownloadURL(imgRefOne);
        console.log("uploaded screen one")
        document.getElementById("publish-btn").innerHTML = t('createsnippet.uploading') + "... => ████████▒▒▒▒▒▒ 56%"
        let screenTwoUrl = await getDownloadURL(imgRefTwo);
        console.log("uploaded screen two")
        document.getElementById("publish-btn").innerHTML = t('createsnippet.uploading') + "... => █████████▒▒▒▒▒ 63%"
        let screenThreeUrl = await getDownloadURL(imgRefThree);
        console.log("uploaded screen three")
        document.getElementById("publish-btn").innerHTML = t('createsnippet.uploading') + "... => ██████████▒▒▒▒ 70%"
        let screenFourUrl = await getDownloadURL(imgRefFour);
        console.log("uploaded screen four")
        document.getElementById("publish-btn").innerHTML = t('createsnippet.uploading') + "... => ███████████▒▒▒ 77%"


        let own_username = "";
        const userRef = doc(db, "users", uid);
        await getDoc(userRef).then((doc) => {
            if (doc.exists()) {
                own_username = doc.data().username;
                document.getElementById("publish-btn").innerHTML = t('createsnippet.uploading') + "... => ████████████▒▒ 84%"

            } else {
                console.log("No such document!");
            }
        });
        let final_interests = [];
        let interests = document.getElementsByClassName("interestpkg");
        for (let i = 0; i < interests.length; i++) {
            if (interests[i].classList.contains("interest-toggled")) {
                final_interests.push(interests[i].innerHTML);
            }
        }


        let pkgUrl = await setDoc(doc(db, "snippets", name_id), {
            name: profanityFilter(name),
            description: profanityFilter(longDesc),
            catchphrase: profanityFilter(desc),
            code: code,
            owner_id: uid,
            owner_username: own_username,
            current_version: version,
            downloads: 0,
            ratings: [],
            interests: final_interests,
            screenshots: [screenOneUrl, screenTwoUrl, screenThreeUrl, screenFourUrl],
            lines: code.split("\n").length,
            created: new Date().getTime(),
            id: name_id
        }).then(async r => {
            document.getElementById("publish-btn").innerHTML = t('createsnippet.uploading') + "... => █████████████▒ 91%"
            // update user packages array with the new package
            const userRef = doc(db, "users", uid);
            await getDoc(userRef).then(async (doc) => {
                if (doc.exists()) {
                    let snippets = doc.data().owned_packages;
                    snippets.push(name_id);
                    await setDoc(userRef, {
                        owned_snippets: snippets
                    }, {merge: true}).then(r => {
                        document.getElementById("publish-btn").innerHTML = t('createsnippet.uploading') + "... => ██████████████ 100%"
                        return name_id
                    })
                } else {
                    console.log("No such document!");
                    return name_id
                }
            })
        })
    }

    const handleInterestClick = (index) => {
        if (document.getElementById("interest" + index).classList.contains("interest-toggled")) {
            document.getElementById("interest" + index).classList.remove("interest-toggled");
        } else {
            document.getElementById("interest" + index).classList.add("interest-toggled");
        }
    }

    return (
        <>
            <Popup modal open={warning} onClose={() => {
                navigate("/snippets")
            }}><span>
                <h4>{t('createsnippet.error')}</h4>
                <p className="popup-signin-txt">{t('createsnippet.sign_in_warning')}.</p>
                <button className="secondary popup-signin-btn"
                        onClick={() => navigate("/sign-in")}>{t('createsnippet.sign_in_warning_btn')}</button>
            </span></Popup>
            <Popup modal open={missingFields}><span>
                <h4>{t('createsnippet.error')}</h4>
                <p className="popup-signin-txt">{t('createsnippet.fields_error')}.</p>
                <button className="secondary popup-signin-btn" onClick={() => setMissingFields(false)}>OK</button>
            </span>
            </Popup>
            <Popup modal open={missingUploads}><span>
                <h4>{t('createsnippet.error')}</h4>
                <p className="popup-signin-txt">{t('createsnippet.uploads_error')}</p>
                <button className="secondary popup-signin-btn" onClick={() => setMissingUploads(false)}>OK</button>
            </span></Popup>
            <div className="split">
                <div className="split-two split-two-height" id="split-two">
                    <h1 className="about-title about-title-card">{t('createsnippet.publish_snippet')}</h1>
                    <div className="split-two-card">
                        <SnippetCard readmore={t("card.readmore")} dwnl_local={t("card.downloads")} dwnl="0"
                                     author={user_data ? user_data.username : "placeholder"}
                                     name={name || "placeholder"}
                                     description={desc || "placeholder"}/>
                    </div>
                </div>
                <div className="split-one">
                    <h1 className="about-title">{t('createsnippet.publish_snippet')}</h1>
                    <div className="centered">
                        <h2>{t('createsnippet.general_info')}</h2>
                        <br/>
                        <label htmlFor="pkg-name" className="name-input-label">{t('createsnippet.name')}</label><br/>
                        <label htmlFor="pkg-name" className="name-input-label-desc">{t('createsnippet.namesub')}</label><br/>
                        <input type="text" className="proto-input" placeholder={t('createsnippet.nameholder')}
                               id="pkg-name"
                               value={name}
                               onChange={e => setName(e.target.value)}/>
                        <br/><br/>
                        <label htmlFor="catch-input"
                               className="name-input-label">{t('createsnippet.catch')}</label><br/>
                        <label htmlFor="catch-input"
                               className="name-input-label-desc">{t('createsnippet.catchsub')}</label><br/>
                        <input type="text" className="proto-input" id="catch-input"
                               placeholder={t('createsnippet.catch_holder')}
                               value={desc} onChange={e => setDesc(e.target.value)}/>

                        <br/><br/>
                        <label className="name-input-label">{t('createsnippet.desc')}</label><br/>
                        <label className="name-input-label-desc">{t('createsnippet.descsub')}</label><br/>
                        <div className="md-editor-container">
                            <MDEditor
                                value={longDesc}
                                onChange={setLongDesc}
                                height={350}
                                className="md-editor"
                            />
                        </div>
                        <br/>
                        <label className="name-input-label">{t('createsnippet.code')}</label><br/>
                        <label className="name-input-label-desc">{t('createsnippet.codesub')}</label><br/>
                        <textarea className="code-editor" placeholder={"⚠️ " + t('createsnippet.codeholder') + " ⚠️"}
                                  value={code}
                                  onChange={e => setCode(e.target.value)}></textarea>

                        <br/>
                        <label className="name-input-label">{t('createsnippet.imgs')}</label><br/>
                        <label className="name-input-label-desc">{t('createsnippet.imgs_sub')}</label><br/>
                        <div className="upload-section snippet-upload-section">
                            <label htmlFor="img-file" className="file-input-label" id="gallery-upload"><BiCloudUpload
                                className="file-input-icon"></BiCloudUpload>{t('createsnippet.upload_imgs')}</label>
                            <br/>
                        </div>

                        <br/><br/>
                        <label className="name-input-label"
                               htmlFor="snippet-version">{t('createsnippet.base_version')}</label><br/>
                        <label className="name-input-label-desc"
                               htmlFor="snippet-version">{t('createsnippet.base_version_sub')}</label><br/>
                        <input type="text" className="proto-input" id="snippet-version"
                               placeholder={t('createsnippet.base_version_holder')}
                               value={version}
                               onChange={e => setVersion(e.target.value)}/>

                        <input type="file" id="img-file" className="file-input" multiple onChange={(event) => {
                            console.log(event.target.files[0])
                            setImgUploadOne(event.target.files[0])
                            setImgUploadTwo(event.target.files[1])
                            setImgUploadThree(event.target.files[2])
                            setImgUploadFour(event.target.files[3])
                            console.log("img")
                            if (event.target.files.length === 4) {
                                document.getElementById("gallery-upload").innerHTML = "✅ " + t('createsnippet.upload_imgs')
                            }
                        }} required accept=".png,.jpeg,.webp, image/jpeg, image/png"/>
                        <br/><br/><br/>
                        <p className="create-package-interest-data">{t('createsnippet.categories')}</p>
                        <div className="create-package-interest-div">
                            {
                                interests_data.map((interest, index) => {
                                    return (
                                        <div className="interestpkg" id={"interest" + index} onClick={() => {
                                            handleInterestClick(index);
                                        }}>
                                            {interest}
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <br/>
                        <button onMouseEnter={() => {
                            if (document.getElementById("publish-btn").style.pointerEvents !== "none") {
                                document.getElementById("publish-btn").innerHTML = ">> " + t('createsnippet.publish_snippet_btn') + " <<"
                            }
                        }} onMouseLeave={() => {
                            if (document.getElementById("publish-btn").style.pointerEvents !== "none") {
                                document.getElementById("publish-btn").innerHTML = t('createsnippet.publish_snippet_btn')
                            }
                        }} onClick={() => {
                            if (name === "" || desc === "" || version === "" || longDesc === "" || code === "" || !/\S/.test(name) || !/\S/.test(desc) || !/\S/.test(version) || !/\S/.test(longDesc) || !/\S/.test(code)) {
                                setMissingFields(true)
                            } else if (!imgUpload0ne || !imgUploadTwo || !imgUploadThree || !imgUploadFour || !banner) {
                                setMissingUploads(true)
                            } else {
                                document.getElementById("publish-btn").style.pointerEvents = "none"
                                document.getElementById("publish-btn").innerHTML = t('createsnippet.uploading') + "... => ▒▒▒▒▒▒▒▒▒▒▒▒▒▒ 0%"
                                upload().then(name_id => {
                                    navigate("/snippets/" + codeblock_id)
                                    window.location.reload()
                                })
                            }
                        }} className="primary publish-btn publish-snippet" id="publish-btn">
                            {t('createsnippet.publish_snippet_btn')}
                        </button>
                        <br/>
                    </div>
                </div>
            </div>
        </>
    )
}