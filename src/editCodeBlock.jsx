import './packagePage.css'
import "./editPackage.css"
import "./codeBlockPage.css"
import {onAuthStateChanged} from "firebase/auth";
import {auth, db, storage} from "./firebase.js";
import fancy_name_to_id, {profanityFilter} from "./utility.js";
import {Link, useLocation, useNavigate} from "react-router-dom";
import Navbar from "./Navbar.jsx";
import MDEditor from "@uiw/react-md-editor";
import React, {useEffect, useState} from "react";
import {deleteObject, getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {deleteDoc, doc, getDoc, setDoc} from "firebase/firestore";
import {FcCancel} from "react-icons/fc";

export default function EditCodeBlock(props) {
    const navigate = useNavigate()
    if (!useLocation().state) {
        navigate("/codeblocks")
    }
    const {state} = useLocation()
    const codeBlock = state.pkg
    let uid = "";
    const [newDesc, setNewDesc] = useState(codeBlock.description)


    const [imgUpload0ne, setImgUploadOne] = useState(null);
    const [imgUploadTwo, setImgUploadTwo] = useState(null);
    const [imgUploadThree, setImgUploadThree] = useState(null);
    const [imgUploadFour, setImgUploadFour] = useState(null);
    const [newVer, setNewVer] = useState("")


    useEffect(() => {
        console.log("HELL YEAAAAA")
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // check if user id is the package owner_id
                if (user.uid === codeBlock.owner_id) {
                    console.log("user is owner")
                    uid = user.uid;
                    console.log(uid)
                } else {
                    console.log("user is not owner")
                    navigate("/codeblocks/" + fancy_name_to_id(codeBlock.id))
                }
            } else {
                console.log("user is not logged in")
                navigate("/codeblocks/" + fancy_name_to_id(codeBlock.id))
            }
        })
    }, []);


    async function saveChanges() {
        let screenOneUrl = ""
        let screenTwoUrl = ""
        let screenThreeUrl = ""
        let screenFourUrl = ""
        let currentVer = ""

        if (imgUpload0ne !== null) {
            const imgRef = ref(storage, codeBlock.screenshots[0]);
            await deleteObject(imgRef).then(() => {
                console.log("deleted")
            })
            let uploadRef = ref(storage, "users/" + uid + "/codeblocks/" + codeBlock.id + "/img/one/" + imgUpload0ne.name)
            await uploadBytes(uploadRef, imgUpload0ne).then(() => {
                console.log("img one uploaded")
            })
            screenOneUrl = await getDownloadURL(uploadRef)

        } else {
            screenOneUrl = codeBlock.screenshots[0]
        }
        if (imgUploadTwo !== null) {
            const imgRef = ref(storage, codeBlock.screenshots[1]);
            await deleteObject(imgRef).then(() => {
                console.log("deleted")
            })
            let uploadRef = ref(storage, "users/" + uid + "/codeblocks/" + codeBlock.id + "/img/two/" + imgUploadTwo.name)
            await uploadBytes(uploadRef, imgUploadTwo).then(() => {
                console.log("img two uploaded")
            })
            screenTwoUrl = await getDownloadURL(uploadRef)
        } else {
            screenTwoUrl = codeBlock.screenshots[1]
        }
        if (imgUploadThree !== null) {
            const imgRef = ref(storage, codeBlock.screenshots[2]);
            await deleteObject(imgRef).then(() => {
                console.log("deleted")
            })
            let uploadRef = ref(storage, "users/" + uid + "/codeblocks/" + codeBlock.id + "/img/three/" + imgUploadThree.name)
            await uploadBytes(uploadRef, imgUploadThree).then(() => {
                console.log("img three uploaded")
            })
            screenThreeUrl = await getDownloadURL(uploadRef)
        } else {
            screenThreeUrl = codeBlock.screenshots[2]
        }
        if (imgUploadFour !== null) {
            const imgRef = ref(storage, codeBlock.screenshots[3]);
            await deleteObject(imgRef).then(() => {
                console.log("deleted")
            })
            let uploadRef = ref(storage, "users/" + uid + "/codeblocks/" + codeBlock.id + "/img/four/" + imgUploadFour.name)
            await uploadBytes(uploadRef, imgUploadFour).then(() => {
                console.log("img four uploaded")
            })
            screenFourUrl = await getDownloadURL(uploadRef)
        } else {
            screenFourUrl = codeBlock.screenshots[3]
        }

        await setDoc(doc(db, "code-blocks", codeBlock.id), {
            screenshots: [screenOneUrl, screenTwoUrl, screenThreeUrl, screenFourUrl],
            description: profanityFilter(newDesc),
            current_version: currentVer,
        }, {merge: true})
    }


    return (
        <>
            <>
                <Navbar/>
                <h2 className="package-title code-block-title">{codeBlock.name}</h2>
                <h3 className="package-author">// BY <Link className="package-author-link"
                                                           to={"/users/" + fancy_name_to_id(codeBlock.owner_username)}>{codeBlock.owner_username}</Link>
                </h3>
                <button className="package-download-btn" id="package-download-btn" onClick={async () => {
                    document.getElementById("package-download-btn").innerHTML = "SAVING.."
                    await saveChanges().then(() => {
                        document.getElementById("package-download-btn").innerHTML = "SAVED ✅"
                        setTimeout(() => {
                            navigate("/codeblocks/" + codeBlock.id)
                            window.location.reload()
                        }, 1000)
                    })

                }}>{"SAVE"}</button>
                <p className="package-description-label">// 01 - DESCRIPTION</p>
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
                    <input type="file" id="img-file-one" style={{display: "none"}}
                           onChange={(event) => setImgUploadOne(event.target.files[0])}
                           required
                           accept=".jpeg,.webp, image/jpeg"/>
                    <input type="file" id="img-file-two" style={{display: "none"}}
                           onChange={(event) => setImgUploadTwo(event.target.files[0])} required
                           accept=".jpeg,.webp, image/jpeg"/>
                    <input type="file" id="img-file-three" style={{display: "none"}}
                           onChange={(event) => setImgUploadThree(event.target.files[0])} required
                           accept=".jpeg,.webp, image/jpeg"/>
                    <input type="file" id="img-file-four" style={{display: "none"}}
                           onChange={(event) => setImgUploadFour(event.target.files[0])} required
                           accept=".jpeg,.webp, image/jpeg"/>
                    <img
                        id="screenshot_one"
                        src={codeBlock.screenshots[0]}
                        className="package-img package-img-edit"
                        onClick={() => {
                            document.getElementById("img-file-one").addEventListener('change', function () {
                                var vals = this.value,
                                    val = vals.length ? vals.split('\\').pop() : '';
                                let fileup = new File([this.files[0]], this.files[0].name, {type: this.files[0].type})
                                setImgUploadTwo(fileup)
                                console.log(fileup)
                                document.getElementById('screenshot_one').src = URL.createObjectURL(fileup);
                            });
                            document.getElementById("img-file-one").click()
                        }}
                        alt="First screenshot"/>
                    <img
                        id="screenshot_two"
                        src={codeBlock.screenshots[1]}
                        className="package-img package-img-edit"
                        style={{marginLeft: "5px"}}
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
                        src={codeBlock.screenshots[2]}
                        className="package-img package-img-edit"
                        alt="Third screenshot"
                        onClick={() => {
                            document.getElementById("img-file-three").addEventListener('change', function () {
                                var vals = this.value,
                                    val = vals.length ? vals.split('\\').pop() : '';
                                let fileup = new File([this.files[0]], this.files[0].name, {type: this.files[0].type})
                                setImgUploadTwo(fileup)
                                console.log(fileup)
                                document.getElementById('screenshot_three').src = URL.createObjectURL(fileup);
                            });
                            document.getElementById("img-file-three").click()
                        }}
                    />
                    <img
                        id="screenshot_four"
                        src={codeBlock.screenshots[3]}
                        className="package-img package-img-edit"
                        style={{marginLeft: "5px"}}
                        alt="Fourth screenshot"
                        onClick={() => {
                            document.getElementById("img-file-four").addEventListener('change', function () {
                                var vals = this.value,
                                    val = vals.length ? vals.split('\\').pop() : '';
                                let fileup = new File([this.files[0]], this.files[0].name, {type: this.files[0].type})
                                setImgUploadTwo(fileup)
                                console.log(fileup)
                                document.getElementById('screenshot_four').src = URL.createObjectURL(fileup);
                            });
                            document.getElementById("img-file-four").click()
                        }}
                    />
                </div>
                <p className="package-characteristics-label"></p>
                <div className="package-characteristics" id="package-characteristics">
                    <p style={{marginRight: "29px"}} id="package-char-p">
                        TOTAL SIZE: {Math.round(codeBlock.sizeMb * 10) / 10}MB<br/><input type='text'
                                                                                          id='pkg-version-input'
                                                                                          className='pkg-version-input'
                                                                                          placeholder='NEW VERSION'
                                                                                          style={{display: "none"}}
                                                                                          value={newVer}
                                                                                          onChange={e => {
                                                                                              setNewVer(e.target.value);
                                                                                              console.log("yup")
                                                                                          }}/><span
                        id="package-version" className="current-ver">CURRENT VERSION: {codeBlock.current_version}</span>
                        <FcCancel className="revert-upload-pkg" id="revert-upload-pkg" onClick={() => {
                            if (document.getElementById("upload-new-pkg-btn").innerHTML.includes("UPLOAD PACKAGE")) {
                                document.getElementById("package-version").innerHTML = "CURRENT VERSION: " + codeBlock.current_version
                                document.getElementById("upload-new-pkg-btn").style.display = "none"
                                document.getElementById("new-pkg-version-btn").style.display = "block"
                                document.getElementById("revert-upload-pkg").style.display = "none"
                                document.getElementById("package-char-p").style.marginRight = "29px"
                                document.getElementById("upload-new-pkg-btn").innerHTML = document.getElementById("upload-new-pkg-btn").innerHTML.replace("✅ UPLOAD PACKAGE", "UPLOAD PACKAGE")
                                // add the icon back
                                document.getElementById("file-input-icon").style.display = "revert"
                                document.getElementById("package-version").innerHTML = "CURRENT VERSION: " + codeBlock.current_version
                                document.getElementById("pkg-version-input").style.display = "none"
                                document.getElementById("delete-pkg-btn").style.display = "revert"
                                document.getElementById("delete-pkg-btn").style.marginTop = "-35px"
                            }

                        }}></FcCancel><br/>
                        <button className="new-pkg-version-btn" id="new-pkg-version-btn" onClick={() => {
                            document.getElementById("package-version").innerHTML = "<br/>"
                            document.getElementById("pkg-version-input").style.display = "block"
                            document.getElementById("upload-new-pkg-btn").style.display = "block"
                            document.getElementById("new-pkg-version-btn").style.display = "none"
                            document.getElementById("revert-upload-pkg").style.display = "block"
                            document.getElementById("package-char-p").style.marginRight = "22px"
                            document.getElementById("delete-pkg-btn").style.display = "none"
                        }}>+ NEW VERSION
                        </button>
                        <br/>
                        <button className="delete-pkg-btn" style={{textAlign: "center", paddingLeft: "15px"}}
                                id="delete-pkg-btn" onClick={async () => {
                            const delete_btn_content = document.getElementById("delete-pkg-btn").innerHTML
                            if (delete_btn_content === "DELETE CODE BLOCK") {
                                document.getElementById("delete-pkg-btn").innerHTML = "CONFIRM (3)"
                                document.getElementById("delete-pkg-btn").style.paddingLeft = "25px"
                            } else if (delete_btn_content === "CONFIRM (3)") {
                                document.getElementById("delete-pkg-btn").innerHTML = "CONFIRM (2)"
                            } else if (delete_btn_content === "CONFIRM (2)") {
                                document.getElementById("delete-pkg-btn").innerHTML = "CONFIRM (1)"
                            } else if (delete_btn_content === "CONFIRM (1)") {
                                document.getElementById("delete-pkg-btn").innerHTML = "CONFIRM (!)"
                            } else if (delete_btn_content === "CONFIRM (!)") {
                                document.getElementById("delete-pkg-btn").innerHTML = "DELETING..."
                                // get the ref of every package screenshot and the ref of the package itself
                                const imgOneRef = ref(storage, codeBlock.screenshots[0]);
                                await deleteObject(imgOneRef).then(() => {
                                    console.log("deleted")
                                })

                                const imgTwoRef = ref(storage, codeBlock.screenshots[1]);
                                await deleteObject(imgTwoRef).then(() => {
                                    console.log("deleted")
                                })

                                const imgThreeRef = ref(storage, codeBlock.screenshots[2]);
                                await deleteObject(imgThreeRef).then(() => {
                                    console.log("deleted")
                                })

                                const imgFourRef = ref(storage, codeBlock.screenshots[3]);
                                await deleteObject(imgFourRef).then(() => {
                                    console.log("deleted")
                                })
                                // remove the package from owned_packages
                                const userRef = doc(db, "users", uid)
                                // remove this package from the user's owned_packages
                                await getDoc(doc(db, "users", uid)).then(async (doc) => {
                                    if (doc.exists()) {
                                        const data = doc.data()
                                        let owned_packages = data.owned_codeblocks
                                        owned_packages.splice(owned_packages.indexOf(codeBlock.id), 1)
                                        await setDoc(userRef, {
                                            owned_packages: owned_packages
                                        }, {merge: true}).then(() => {
                                            console.log("removed codeblock from owned_codeblocks")
                                        })
                                    }
                                })
                                // delete the package from the database
                                await deleteDoc(doc(db, "code-blocks", codeBlock.id)).then(() => {
                                    console.log("deleted codeblock from db")
                                }).then(() => {
                                    navigate("/codeblocks")
                                    window.location.reload()
                                })

                            }
                        }}>DELETE CODE BLOCK
                        </button>
                    </p>
                </div>
                <div className="bottom-block"></div>
            </>

        </>
    )

}