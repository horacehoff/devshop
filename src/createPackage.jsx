import "./createPackage.css"
import {useState} from "react";
import {auth, db, storage, user_data} from "./firebase.js";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage"
import {onAuthStateChanged} from "firebase/auth";
import {useNavigate} from "react-router-dom";
import {doc, getDoc, setDoc} from "firebase/firestore";
import fancy_name_to_id, {generateUUID, interests_data, profanityFilter} from "./utility.js";
import MDEditor from '@uiw/react-md-editor';
import {BiCloudUpload} from "react-icons/bi";
import PackageCard from "./packageCard.jsx";
import Popup from "reactjs-popup";
import "./modal.css"
import "./createPackage.json"
import i18n from "i18next";
import data from "./createPackage.json";
import card from "./packageSnippetCard.json"
import {useTranslation} from "react-i18next";

export default function CreatePackage() {
    i18n.addResourceBundle("en", "createpkg", data.en)
    i18n.addResourceBundle("en", "createpkg", card.en)
    i18n.addResourceBundle("fr", "createpkg", data.fr)
    i18n.addResourceBundle("fr", "createpkg", card.fr)
    const {t} = useTranslation("createpkg");



    const [pkgUpload, setPkgUpload] = useState(null);

    const [imgUpload0ne, setImgUploadOne] = useState(null);

    const [imgUploadTwo, setImgUploadTwo] = useState(null);

    const [imgUploadThree, setImgUploadThree] = useState(null);

    const [imgUploadFour, setImgUploadFour] = useState(null);

    const [banner, setBanner] = useState(null);

    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [version, setVersion] = useState("");
    const [longDesc, setLongDesc] = useState("**" + t('createpkg.descholder') + "**");
    let pkg_id = "";

    const [warning, setWarning] = useState(false);
    const [missingFields, setMissingFields] = useState(false);
    const [missingUploads, setMissingUploads] = useState(false);

    let uid = "";
    const navigate = useNavigate()
    onAuthStateChanged(auth, (user) => {
        if (user) {
            uid = user.uid;
            document.evaluate("/html/body/div/div[3]/div[2]/div/div[1]/div/div[1]/ul[2]/li[4]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.remove();
            document.evaluate("/html/body/div/div[3]/div[2]/div/div[1]/div/div[1]/ul[2]/li[4]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.remove();
        } else {
            setWarning(true)
        }
    });
    const upload = async () => {
        let name_id = generateUUID(fancy_name_to_id(name))
        pkg_id = name_id;
        let extension = pkgUpload.type.replace(/(.*)\//g, '')
        let pkgRef = ref(storage, "users/" + uid + "/packages/" + name_id + "/pkg/" + fancy_name_to_id(name) + "." + extension)
        await uploadBytes(pkgRef, pkgUpload).then(() => {
            document.getElementById("publish-btn").innerHTML = t('createpkg.uploading') + " => █▒▒▒▒▒▒▒▒▒▒▒▒▒ 7%"
        });

        let bannerRef = ref(storage, "users/" + uid + "/packages/" + name_id + "/img/banner/" + banner.name)
        await uploadBytes(bannerRef, banner).then(() => {
            document.getElementById("publish-btn").innerHTML = t('createpkg.uploading') + " => ██▒▒▒▒▒▒▒▒▒▒▒▒ 14%"
        })

        let imgRefOne = ref(storage, "users/" + uid + "/packages/" + name_id + "/img/one/" + (imgUpload0ne.name ?? ("screenone" + imgUpload0ne.type)))
        await uploadBytes(imgRefOne, imgUpload0ne).then(() => {
            document.getElementById("publish-btn").innerHTML = t('createpkg.uploading') + " => ███▒▒▒▒▒▒▒▒▒▒▒ 21%"
        })

        let imgRefTwo = ref(storage, "users/" + uid + "/packages/" + name_id + "/img/two/" + imgUploadTwo.name ?? ("screentwo" + imgUpload0ne.type))
        await uploadBytes(imgRefTwo, imgUploadTwo).then(() => {
            document.getElementById("publish-btn").innerHTML = t('createpkg.uploading') + " => ████▒▒▒▒▒▒▒▒▒▒ 28%"
        })

        let imgRefThree = ref(storage, "users/" + uid + "/packages/" + name_id + "/img/three/" + imgUploadThree.name ?? ("screenthree" + imgUpload0ne.type))
        await uploadBytes(imgRefThree, imgUploadThree).then(() => {
            document.getElementById("publish-btn").innerHTML = t('createpkg.uploading') + " => █████▒▒▒▒▒▒▒▒▒ 35%"
        })

        let imgRefFour = ref(storage, "users/" + uid + "/packages/" + name_id + "/img/four/" + imgUploadFour.name ?? ("screenfour" + imgUpload0ne.type))
        await uploadBytes(imgRefFour, imgUploadFour).then(() => {
            document.getElementById("publish-btn").innerHTML = t('createpkg.uploading') + " => ██████▒▒▒▒▒▒▒▒ 42%"
        })

        let bannerUrl = await getDownloadURL(bannerRef);
        console.log("uploaded banner")
        document.getElementById("publish-btn").innerHTML = t('createpkg.uploading') + " => ███████▒▒▒▒▒▒▒ 49%"
        let screenOneUrl = await getDownloadURL(imgRefOne);
        console.log("uploaded screen one")
        document.getElementById("publish-btn").innerHTML = t('createpkg.uploading') + " => ████████▒▒▒▒▒▒ 56%"
        let screenTwoUrl = await getDownloadURL(imgRefTwo);
        console.log("uploaded screen two")
        document.getElementById("publish-btn").innerHTML = t('createpkg.uploading') + " => █████████▒▒▒▒▒ 63%"
        let screenThreeUrl = await getDownloadURL(imgRefThree);
        console.log("uploaded screen three")
        document.getElementById("publish-btn").innerHTML = t('createpkg.uploading') + " => ██████████▒▒▒▒ 70%"
        let screenFourUrl = await getDownloadURL(imgRefFour);
        console.log("uploaded screen four")
        document.getElementById("publish-btn").innerHTML = t('createpkg.uploading') + " => ███████████▒▒▒ 77%"


        let own_username = "";
        const userRef = doc(db, "users", uid);
        await getDoc(userRef).then((doc) => {
            if (doc.exists()) {
                own_username = doc.data().username;
                document.getElementById("publish-btn").innerHTML = t('createpkg.uploading') + " => ████████████▒▒ 84%"

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


        let pkgUrl = await getDownloadURL(pkgRef).then(async (pkgUrl) => {
            await setDoc(doc(db, "packages", name_id), {
                name: profanityFilter(name),
                description: profanityFilter(longDesc),
                catchphrase: profanityFilter(desc),
                owner_id: uid,
                owner_username: own_username,
                current_version: version,
                downloads: [],
                ratings: [],
                interests: final_interests,
                banner: bannerUrl,
                screenshots: [screenOneUrl, screenTwoUrl, screenThreeUrl, screenFourUrl],
                package: pkgUrl,
                sizeMb: pkgUpload.size / 1000000,
                created: new Date().getTime(),
                id: name_id
            }).then(async r => {
                document.getElementById("publish-btn").innerHTML = t('createpkg.uploading') + " => █████████████▒ 91%"
                // update user packages array with the new package
                const userRef = doc(db, "users", uid);
                await getDoc(userRef).then(async (doc) => {
                    if (doc.exists()) {
                        let packages = doc.data().owned_packages;
                        packages.push(name_id);
                        await setDoc(userRef, {
                            owned_packages: packages
                        }, {merge: true}).then(r => {
                            document.getElementById("publish-btn").innerHTML = t('createpkg.uploading') + " => ██████████████ 100%"
                            return name_id
                        })
                    } else {
                        console.log("No such document!");
                        return name_id
                    }
                })
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

    const [bannerURL, setBannerURL] = useState("");

    return (
        <>
            <Popup modal open={warning} onClose={() => {
                navigate("/packages")
            }}><span>
                <h4>{t('createpkg.error')}</h4>
                <p className="popup-signin-txt">{t('createpkg.sign_in_warning')}.</p>
                <button className="secondary popup-signin-btn"
                        onClick={() => navigate("/sign-in")}>{t('createpkg.sign_in_warning_btn')}</button>
                {/*<button className="primary popup-back-btn" onClick={() => navigate("/packages")}>GO BACK</button>*/}
            </span>
            </Popup>
            <Popup modal open={missingFields}><span>
                <h4>{t('createpkg.error')}</h4>
                <p className="popup-signin-txt">{t('createpkg.fields_error')}.</p>
                <button className="secondary popup-signin-btn" onClick={() => setMissingFields(false)}>OK</button>
            </span>
            </Popup>
            <Popup modal open={missingUploads}><span>
                <h4>{t('createpkg.error')}</h4>
                <p className="popup-signin-txt">{t('createpkg.uploads_error')}.</p>
                <button className="secondary popup-signin-btn" onClick={() => setMissingUploads(false)}>OK</button>
            </span></Popup>
            <div className="split">
                <div className="split-two" id="split-two">
                    <h1 className="about-title about-title-card">{t('createpkg.publish_pkg')}</h1>
                    <div className="split-two-card">
                        <PackageCard readmore={t("card.readmore")} dwnl_local={t("card.downloads")} dwnl={[]}
                                     author={user_data ? user_data.username : "placeholder"}
                                     name={name || "placeholder"}
                                     catchphrase={desc || "placeholder"} banner={bannerURL}/>
                    </div>
                </div>
                <div className="split-one">
                    <h1 className="about-title">PUBLISH A PACKAGE</h1>
                    <div className="centered">
                        <h2>{t('createpkg.general_info')}</h2>
                        <br/>
                        <label htmlFor="name-input" className="name-input-label">{t('createpkg.name')}</label><br/>
                        <label htmlFor="name-input"
                               className="name-input-label-desc">{t('createpkg.namesub')}</label><br/>
                        <input type="text" className="proto-input" id="name-input"
                               placeholder={t('createpkg.nameholder')}
                               value={name}
                               onChange={e => setName(e.target.value)}/>
                        <br/><br/>
                        <label htmlFor="catch-input" className="name-input-label">{t('createpkg.catch')}</label><br/>
                        <label htmlFor="catch-input" className="name-input-label-desc">{t('createpkg.catchsub')}</label><br/>
                        <input type="text" className="proto-input" id="catch-input"
                               placeholder={t('createpkg.catch_holder')}
                               value={desc} onChange={e => setDesc(e.target.value)}/>

                        <br/><br/>
                        <label className="name-input-label">{t('createpkg.desc')}</label><br/>
                        <label className="name-input-label-desc">{t('createpkg.descsub')}</label><br/>
                        <div className="md-editor-container">
                            <MDEditor
                                value={longDesc}
                                onChange={setLongDesc}
                                height={350}
                                className="md-editor"
                            />
                        </div>

                        <br/>
                        <label className="name-input-label">{t('createpkg.uploads')}</label><br/>
                        <label className="name-input-label-desc">{t('createpkg.uploads_sub')}</label><br/>
                        <input type="file" id="banner-file" className="file-input" onChange={(event) => {
                            setBanner(event.target.files[0])
                            setBannerURL(URL.createObjectURL(event.target.files[0]))
                            document.getElementById("banner-upload").innerHTML = "✅ " + t('createpkg.upload_banner')
                        }} accept=".jpeg,.webp, image/jpeg" required/>
                        <div className="upload-section">
                            <label htmlFor="banner-file" className="file-input-label" id="banner-upload"><BiCloudUpload
                                className="file-input-icon"></BiCloudUpload>{t('createpkg.upload_banner')}</label>
                            <label htmlFor="file" className="file-input-label" id="file-upload"><BiCloudUpload
                                className="file-input-icon"></BiCloudUpload>{t('createpkg.upload_pkg')}</label>
                            <label htmlFor="img-file" className="file-input-label" id="gallery-upload"><BiCloudUpload
                                className="file-input-icon"></BiCloudUpload>{t('createpkg.upload_imgs')}</label>
                            <br/>
                        </div>
                        <br/><br/>
                        <label className="name-input-label"
                               htmlFor="pkg-version">{t('createpkg.base_version')}</label><br/>
                        <label className="name-input-label-desc"
                               htmlFor="pkg-version">{t('createpkg.base_version_sub')}</label><br/>
                        <input type="text" className="proto-input" id="pkg-version"
                               placeholder={t('createpkg.base_version_holder')}
                               value={version}
                               onChange={e => setVersion(e.target.value)}/>
                        <br/>
                        <input type="file" id="file" className="file-input" onChange={(event) => {
                            setPkgUpload(event.target.files[0])
                            console.log("pkg")
                            document.getElementById("file-upload").innerHTML = "✅ " + t('createpkg.upload_pkg')
                        }} accept=".zip, application/zip" required/>


                        <input type="file" id="img-file" className="file-input" multiple onChange={(event) => {
                            console.log(event.target.files[0])
                            setImgUploadOne(event.target.files[0])
                            setImgUploadTwo(event.target.files[1])
                            setImgUploadThree(event.target.files[2])
                            setImgUploadFour(event.target.files[3])
                            console.log("img")
                            if (event.target.files.length === 4) {
                                document.getElementById("gallery-upload").innerHTML = "✅ " + t('createpkg.upload_imgs')
                            }
                        }} required accept=".png,.jpeg,.webp, image/jpeg, image/png"/>
                        <br/><br/>
                        <p className="create-package-interest-data">{t('createpkg.categories')}</p>
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
                                document.getElementById("publish-btn").innerHTML = ">> " + t('createpkg.publish_pkg_btn') + " <<"
                            }
                        }} onMouseLeave={() => {
                            if (document.getElementById("publish-btn").style.pointerEvents !== "none") {
                                document.getElementById("publish-btn").innerHTML = t('createpkg.publish_pkg_btn')
                            }
                        }} onClick={() => {
                            if (name === "" || desc === "" || version === "" || longDesc === "" || !/\S/.test(name) || !/\S/.test(desc) || !/\S/.test(version) || !/\S/.test(longDesc)) {
                                setMissingFields(true)
                            } else if (!pkgUpload || !imgUpload0ne || !imgUploadTwo || !imgUploadThree || !imgUploadFour || !banner) {
                                setMissingUploads(true)
                            } else {
                                document.getElementById("publish-btn").style.pointerEvents = "none"
                                document.getElementById("publish-btn").innerHTML = t('createpkg.uploading') + " => ▒▒▒▒▒▒▒▒▒▒▒▒▒▒ 0%"
                                document.getElementById("publish-btn").innerHTML = t('createpkg.uploading') + " => ▒▒▒▒▒▒▒▒▒▒▒▒▒▒ 0%"
                                upload().then(name_id => {
                                    navigate("/packages/" + pkg_id)
                                    window.location.reload()
                                })
                            }
                        }} className="primary publish-btn" id="publish-btn">
                            {t('createpkg.publish_pkg_btn')}
                        </button>
                        <button onClick={async () => {
                            await setDoc(doc(db, "packages", window.crypto.randomUUID()), {
                                name: window.crypto.randomUUID(),
                                description: "test",
                                catchphrase: "test",
                                owner_id: uid,
                                owner_username: "just-a-mango",
                                current_version: version,
                                downloads: [],
                                ratings: [],
                                banner: "https://firebasestorage.googleapis.com/v0/b/devshop-data.appspot.com/o/users%2FSPkD1UYkP3akz5mLRKwg30SvQTu2%2Fpackages%2F1539202174%2Fimg%2Fbanner%2F1945_Nagasakibomb_CharlesLevy.jpg.webp?alt=media&token=d0c3b409-1ff9-4216-8faf-6f300848ab9f",
                                created: new Date().getTime(),
                                id: window.crypto.randomUUID()
                            }).then(async r => {
                                document.getElementById("publish-btn").innerHTML = t('createpkg.uploading') + " => █████████████▒ 91%"
                                // update user packages array with the new package
                                const userRef = doc(db, "users", uid);
                                await getDoc(userRef).then(async (doc) => {
                                    if (doc.exists()) {
                                        let packages = doc.data().owned_packages;
                                        packages.push(name_id);
                                        await setDoc(userRef, {
                                            owned_packages: packages
                                        }, {merge: true}).then(r => {
                                            document.getElementById("publish-btn").innerHTML = t('createpkg.uploading') + " => ██████████████ 100%"
                                            return name_id
                                        })
                                    } else {
                                        console.log("No such document!");
                                        return name_id
                                    }
                                })
                            })
                        }}></button>
                    </div>
                    <br/>
                </div>
            </div>


        </>
    )
}