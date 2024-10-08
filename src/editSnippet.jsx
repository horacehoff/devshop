import './packagePage.css'
import "./editPackage.css"
import "./snippetPage.css"
import "./editSnippet.css"
import {onAuthStateChanged} from "firebase/auth";
import {auth, db, storage} from "./firebase.js";
import fancy_name_to_id, {profanityFilter} from "./utility.js";
import {Link, useLocation, useNavigate} from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import React, {useEffect, useState} from "react";
import {deleteObject, getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {deleteDoc, doc, getDoc, setDoc} from "firebase/firestore";
import Popup from "reactjs-popup";
import data from "./packageSnippet.json"
import i18n from "i18next";
import {useTranslation} from "react-i18next";

export default function EditSnippet(props) {
    i18n.addResourceBundle("en", "pkgcode", data.en)
    i18n.addResourceBundle("fr", "pkgcode", data.fr)
    const {t} = useTranslation("pkgcode");


    const navigate = useNavigate()
    if (!useLocation().state) {
        navigate("/snippets")
    }
    const {state} = useLocation()
    const snippet = state.pkg
    const [uid, setUid] = useState("")
    const [newName, setNewName] = useState()
    const [newDesc, setNewDesc] = useState(snippet.description)


    const [imgUpload0ne, setImgUploadOne] = useState(null);
    const [imgUploadTwo, setImgUploadTwo] = useState(null);
    const [imgUploadThree, setImgUploadThree] = useState(null);
    const [imgUploadFour, setImgUploadFour] = useState(null);
    const [newVer, setNewVer] = useState("")
    const [newCode, setNewCode] = useState(snippet.code)


    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // check if user id is the package owner_id
                if (user.uid === snippet.owner_id) {
                    console.log("user is owner")
                    setUid(user.uid)
                    setNewName(snippet.name)
                    console.log(uid)
                } else {
                    console.log("user is not owner")
                    navigate("/snippets/" + fancy_name_to_id(snippet.id))
                }
            } else {
                console.log("user is not logged in")
                navigate("/snippets/" + fancy_name_to_id(snippet.id))
            }
        })
    }, []);


    async function saveChanges() {
        console.log(uid)
        let screenOneUrl
        let screenTwoUrl
        let screenThreeUrl
        let screenFourUrl
        let currentVer
        let currentCode

        if (imgUpload0ne !== null) {
            console.log("IMG ONE")
            const imgRef = ref(storage, snippet.screenshots[0]);
            await deleteObject(imgRef).then(() => {
                console.log("deleted")
            })
            console.log("users/" + uid + "/snippets/" + snippet.id + "/img/one/" + imgUpload0ne.name)
            let uploadRef = ref(storage, "users/" + uid + "/snippets/" + snippet.id + "/img/one/" + imgUpload0ne.name)
            await uploadBytes(uploadRef, imgUpload0ne).then(() => {
                console.log("img one uploaded")
            })
            screenOneUrl = await getDownloadURL(uploadRef)
        } else {
            console.log("IMG ONE ELSE")
            screenOneUrl = snippet.screenshots[0]
        }
        if (imgUploadTwo !== null) {
            console.log("IMG TWO")
            const imgRef = ref(storage, snippet.screenshots[1]);
            await deleteObject(imgRef).then(() => {
                console.log("deleted")
            })
            let uploadRef = ref(storage, "users/" + uid + "/snippets/" + snippet.id + "/img/two/" + imgUploadTwo.name)
            await uploadBytes(uploadRef, imgUploadTwo).then(() => {
                console.log("img two uploaded")
            })
            screenTwoUrl = await getDownloadURL(uploadRef)
        } else {
            console.log("IMG TWO ELSE")
            screenTwoUrl = snippet.screenshots[1]
        }
        if (imgUploadThree !== null) {
            console.log("IMG THREE")
            const imgRef = ref(storage, snippet.screenshots[2]);
            await deleteObject(imgRef).then(() => {
                console.log("deleted")
            })
            let uploadRef = ref(storage, "users/" + uid + "/snippets/" + snippet.id + "/img/three/" + imgUploadThree.name)
            await uploadBytes(uploadRef, imgUploadThree).then(() => {
                console.log("img three uploaded")
            })
            screenThreeUrl = await getDownloadURL(uploadRef)
        } else {
            console.log("IMG THREE ELSE")
            screenThreeUrl = snippet.screenshots[2]
        }
        if (imgUploadFour !== null) {
            console.log("IMG FOUR")
            const imgRef = ref(storage, snippet.screenshots[3]);
            await deleteObject(imgRef).then(() => {
                console.log("deleted")
            })
            let uploadRef = ref(storage, "users/" + uid + "/snippets/" + snippet.id + "/img/four/" + imgUploadFour.name)
            await uploadBytes(uploadRef, imgUploadFour).then(() => {
                console.log("img four uploaded")
            })
            screenFourUrl = await getDownloadURL(uploadRef)
        } else {
            console.log("IMG FOUR ELSE")
            screenFourUrl = snippet.screenshots[3]
        }
        if (newVer === "") {
            currentVer = snippet.current_version
        } else {
            currentVer = newVer
        }
        if (newCode === "") {
            currentCode = snippet.code
        } else {
            currentCode = newCode
        }

        await setDoc(doc(db, "snippets", snippet.id), {
            screenshots: [screenOneUrl, screenTwoUrl, screenThreeUrl, screenFourUrl],
            description: profanityFilter(newDesc),
            current_version: currentVer,
            code: currentCode,
            name: newName
        }, {merge: true})
    }


    return (
        <>
            <input type="text" className="package-title edit-package-title edit-snippet-title"
                   placeholder={t("pkgcode.nameholder")}
                   value={newName} onChange={e => setNewName(e.target.value)}/>

            <h3 className="package-author">{t("pkgcode.by")} <Link className="package-author-link"
                                                    to={"/users/" + fancy_name_to_id(snippet.owner_username)}>{snippet.owner_username}</Link>
            </h3>
            <button className="package-download-btn" id="package-download-btn" onClick={async () => {
                document.getElementById("package-download-btn").innerHTML = t("pkgcode.saving") + ".."
                await saveChanges().then(() => {
                    document.getElementById("package-download-btn").innerHTML = t("pkgcode.saved") + " ✅"
                    setTimeout(() => {
                        navigate("/snippets/" + snippet.id)
                        window.location.reload()
                    }, 1000)
                })

            }}>{t("pkgcode.save")}</button>
            <p className="package-description-label">// 01 - {t("pkgcode.desc")}</p>
            <p className="package-description package-description-edit">{
                <MDEditor
                    className="package-desc-editor-edit"
                    height="100%"
                    id="package-desc-editor"
                    value={newDesc}
                    onChange={setNewDesc}
                />
            }</p>
            <div className="package-screenshots code-screenshots" id="package-screenshots">
                <input type="file" id="img-file-one" className="file-input"
                       onChange={(event) => setImgUploadOne(event.target.files[0])}
                       required
                       accept=".jpeg,.webp, image/jpeg"/>
                <input type="file" id="img-file-two" className="file-input"
                       onChange={(event) => setImgUploadTwo(event.target.files[0])} required
                       accept=".jpeg,.webp, image/jpeg"/>
                <input type="file" id="img-file-three" className="file-input"
                       onChange={(event) => setImgUploadThree(event.target.files[0])} required
                       accept=".jpeg,.webp, image/jpeg"/>
                <input type="file" id="img-file-four" className="file-input"
                       onChange={(event) => setImgUploadFour(event.target.files[0])} required
                       accept=".jpeg,.webp, image/jpeg"/>
                <img
                    id="screenshot_one"
                    src={snippet.screenshots[0]}
                    className="package-img package-img-edit"
                    onClick={() => {
                        document.getElementById("img-file-one").addEventListener('change', function () {
                            var vals = this.value,
                                val = vals.length ? vals.split('\\').pop() : '';
                            let fileup = new File([this.files[0]], this.files[0].name, {type: this.files[0].type})
                            setImgUploadOne(fileup)
                            console.log(fileup)
                            document.getElementById('screenshot_one').src = URL.createObjectURL(fileup);
                        });
                        document.getElementById("img-file-one").click()
                    }}
                    alt="First screenshot"/>
                <img
                    id="screenshot_two"
                    src={snippet.screenshots[1]}
                    className="package-img package-img-edit"
                    alt="Second screenshot"
                    onClick={() => {
                        document.getElementById("img-file-two").addEventListener('change', function () {
                            var vals = this.value,
                                val = vals.length ? vals.split('\\').pop() : '';
                            let fileup = new File([this.files[0]], this.files[0].name, {type: this.files[0].type})
                            setImgUploadTwo(fileup)
                            console.log(fileup)
                            document.getElementById('screenshot_two').src = URL.createObjectURL(fileup);
                        });
                        document.getElementById("img-file-two").click()
                    }}
                /><br id="codescreenshotbreak"/>
                <img
                    id="screenshot_three"
                    src={snippet.screenshots[2]}
                    className="package-img package-img-edit"
                    alt="Third screenshot"
                    onClick={() => {
                        document.getElementById("img-file-three").addEventListener('change', function () {
                            var vals = this.value,
                                val = vals.length ? vals.split('\\').pop() : '';
                            let fileup = new File([this.files[0]], this.files[0].name, {type: this.files[0].type})
                            setImgUploadThree(fileup)
                            console.log(fileup)
                            document.getElementById('screenshot_three').src = URL.createObjectURL(fileup);
                        });
                        document.getElementById("img-file-three").click()
                    }}
                />
                <img
                    id="screenshot_four"
                    src={snippet.screenshots[3]}
                    className="package-img package-img-edit"
                    alt="Fourth screenshot"
                    onClick={() => {
                        document.getElementById("img-file-four").addEventListener('change', function () {
                            var vals = this.value,
                                val = vals.length ? vals.split('\\').pop() : '';
                            let fileup = new File([this.files[0]], this.files[0].name, {type: this.files[0].type})
                            setImgUploadFour(fileup)
                            console.log(fileup)
                            document.getElementById('screenshot_four').src = URL.createObjectURL(fileup);
                        });
                        document.getElementById("img-file-four").click()
                    }}
                />
            </div>
            <button className="code-forward-btn" id="code-forward-btn" onClick={() => {
                if (document.getElementById("code-forward-btn").innerText === "<<") {
                    document.getElementById("screenshot_one").scrollIntoView({behavior: "smooth", block: "center"})
                    document.getElementById("code-forward-btn").innerText = ">>"
                } else {
                    document.getElementById("screenshot_four").scrollIntoView({behavior: "smooth", block: "center"})
                    document.getElementById("code-forward-btn").innerText = "<<"
                }
            }}>{">>"}</button>
            <p className="package-characteristics-label"></p>
            <div className="package-characteristics" id="package-characteristics">
                <p id="package-char-p">
                    {snippet.lines} {t("pkgcode.code_lines")}
                    <br/>
                    <span id="package-version"
                          className="current-ver">{t("pkgcode.version")}: {snippet.current_version}</span><br/>

                    <Popup trigger={
                        <button className="new-pkg-version-btn" id="new-pkg-version-btn" onClick={() => {
                            let dialog = document.getElementById("new-ver-dialog")
                            dialog.showModal()
                        }}>+ {t("pkgcode.new_version")}
                        </button>
                    } modal className="new-pkg-version-popup">
                        <p className="new-pkg-version-title">{t("pkgcode.publish_new_version")}</p>
                        <label className="name-input-label" htmlFor="pkg-version"
                               id="new-version-label">{t("pkgcode.new_version")}</label><br/>
                        <label className="name-input-label-desc"
                               htmlFor="pkg-version">{t("pkgcode.new_version_code_sub_1")}
                            <br/>{t("pkgcode.new_version_sub_2")}</label><br/>
                        <input type="text" className="proto-input new-pkg-version-input" id="pkg-version"
                               placeholder={t("pkgcode.new_version_code_holder")}
                               value={newVer} onChange={e => setNewVer(e.target.value)}/>

                        <br/>
                        <br/>
                        <label className="name-input-label" htmlFor="code-editor"
                               id="new-version-label">{t("pkgcode.new_version_code_title")}</label><br/>
                        <label className="name-input-label-desc"
                               htmlFor="code-editor">{t("pkgcode.new_version_code_sub")}</label><br/>
                        <textarea className="code-editor edit-code-editor" id="code-editor"
                                  placeholder={"⚠️ " + t("pkgcode.final_code_holder") + " ⚠️"} value={newCode}
                                  onChange={e => setNewCode(e.target.value)}></textarea><br/>
                        <button className="primary" onClick={async () => {
                            document.getElementById("snippet-publish-btn").innerHTML = t("pkgcode.publishing") + "..."
                            let currentVer
                            let currentCode

                            if (newVer === "") {
                                currentVer = snippet.current_version
                            } else {
                                currentVer = newVer
                            }
                            if (newCode === "") {
                                currentCode = snippet.code
                            } else {
                                currentCode = newCode
                            }

                            await setDoc(doc(db, "snippets", snippet.id), {
                                current_version: currentVer,
                                code: currentCode
                            }, {merge: true})
                            document.getElementById("snippet-publish-btn").innerHTML = t("pkgcode.published") + " ✅"
                            setTimeout(() => {
                                navigate("/snippets/" + snippet.id)
                                window.location.reload()
                            }, 1000)


                        }} id="snippet-publish-btn">{t("pkgcode.publish")}
                        </button>
                    </Popup>

                    <br/>
                    <button className="delete-pkg-btn delete-snippet-btn"
                            id="delete-pkg-btn" onClick={async () => {
                        const delete_btn_content = document.getElementById("delete-pkg-btn").innerHTML
                        if (delete_btn_content === "DELETE SNIPPET") {
                            document.getElementById("delete-pkg-btn").innerHTML = t("pkgcode.deleteconfirm") + " (3)"
                            document.getElementById("delete-pkg-btn").style.paddingLeft = "25px"
                        } else if (delete_btn_content === "CONFIRM (3)") {
                            document.getElementById("delete-pkg-btn").innerHTML = t("pkgcode.deleteconfirm") + " (2)"
                        } else if (delete_btn_content === "CONFIRM (2)") {
                            document.getElementById("delete-pkg-btn").innerHTML = t("pkgcode.deleteconfirm") + " (1)"
                        } else if (delete_btn_content === "CONFIRM (1)") {
                            document.getElementById("delete-pkg-btn").innerHTML = t("pkgcode.deleteconfirm") + " (!)"
                        } else if (delete_btn_content === "CONFIRM (!)") {
                            document.getElementById("delete-pkg-btn").innerHTML = t("pkgcode.deleting") + "..."
                            console.log("DELETING IMAGES")
                            // get the ref of every package screenshot and the ref of the package itself
                            const imgOneRef = ref(storage, snippet.screenshots[0]);
                            await deleteObject(imgOneRef).then(() => {
                                console.log("deleted")
                            })

                            const imgTwoRef = ref(storage, snippet.screenshots[1]);
                            await deleteObject(imgTwoRef).then(() => {
                                console.log("deleted")
                            })

                            const imgThreeRef = ref(storage, snippet.screenshots[2]);
                            await deleteObject(imgThreeRef).then(() => {
                                console.log("deleted")
                            })

                            const imgFourRef = ref(storage, snippet.screenshots[3]);
                            await deleteObject(imgFourRef).then(() => {
                                console.log("deleted")
                            })
                            console.log("DELETED IMAGES")
                            // remove the package from owned_packages
                            const userRef = doc(db, "users", uid)
                            // remove this package from the user's owned_packages
                            await getDoc(doc(db, "users", uid)).then(async (doc) => {
                                if (doc.exists()) {
                                    const data = doc.data()
                                    let owned_packages = data.owned_snippets
                                    owned_packages.splice(owned_packages.indexOf(snippet.id), 1)
                                    console.log("modifiying owned_snippets")
                                    await setDoc(userRef, {
                                        owned_snippets: owned_packages
                                    }, {merge: true}).then(() => {
                                        console.log("removed codeblock from owned_snippets")
                                    })
                                }
                            })
                            console.log("got user doc")
                            // delete the package from the database
                            console.log("deleting codeblock from db")
                            await deleteDoc(doc(db, "snippets", snippet.id)).then(() => {
                                console.log("deleted codeblock from db")
                            }).then(() => {
                                navigate("/snippets")
                                window.location.reload()
                            })

                        }
                    }}>{t("pkgcode.deletesnippet")}
                    </button>
                </p>
            </div>
            <div className="bottom-block"></div>
        </>
    )

}