import './packagePage.css'
import "./editPackage.css"
import {onAuthStateChanged} from "firebase/auth";
import {auth, db, storage} from "./firebase.js";
import fancy_name_to_id, {profanityFilter} from "./utility.js";
import {useLocation, useNavigate} from "react-router-dom";
import Navbar from "./Navbar.jsx";
import MDEditor from "@uiw/react-md-editor";
import React, {useLayoutEffect, useState} from "react";
import {deleteObject, getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {deleteDoc, doc, getDoc, setDoc} from "firebase/firestore";
import {BiCloudUpload} from "react-icons/bi";
import {FcCancel} from "react-icons/fc";

export default function EditPackage(props) {
    const navigate = useNavigate()
    if (!useLocation().state) {
        navigate("/packages")
    }
    const {state} = useLocation()
    const pkg = state.pkg
    const [uid, setUid] = useState("")
    const [newDesc, setNewDesc] = useState(pkg.description)

    const [bannerUpload, setBannerUpload] = useState(null);
    const [imgUpload0ne, setImgUploadOne] = useState(null);
    const [imgUploadTwo, setImgUploadTwo] = useState(null);
    const [imgUploadThree, setImgUploadThree] = useState(null);
    const [imgUploadFour, setImgUploadFour] = useState(null);
    const [newVer, setNewVer] = useState("")

    const [pkgUpload, setPkgUpload] = useState(null);


    onAuthStateChanged(auth, (user) => {
        if (user) {
            // check if user id is the package owner_id
            if (user.uid === pkg.owner_id) {
                console.log("user is owner")
                setUid(user.uid)
                console.log(uid)
            } else {
                console.log("user is not owner")
                navigate("/packages/" + fancy_name_to_id(pkg.id))
            }
        } else {
            console.log("user is not logged in")
            navigate("/packages/" + fancy_name_to_id(pkg.id))
        }
    })

    async function saveChanges() {
        let screenOneUrl = ""
        let screenTwoUrl = ""
        let screenThreeUrl = ""
        let screenFourUrl = ""
        let bannerUrl = ""
        let pkgUrl = ""
        let currentVer = ""

        if (bannerUpload !== null) {
            const imgRef = ref(storage, pkg.banner);
            await deleteObject(imgRef).then(() => {
                console.log("deleted")
            })
            let uploadRef = ref(storage, "users/" + uid + "/packages/" + pkg.id + "/img/banner/" + bannerUpload.name)
            await uploadBytes(uploadRef, bannerUpload).then(() => {
                console.log("banner uploaded")
            })
            bannerUrl = await getDownloadURL(uploadRef)

        } else {
            bannerUrl = pkg.banner
        }
        if (imgUpload0ne !== null) {
            const imgRef = ref(storage, pkg.screenshots[0]);
            await deleteObject(imgRef).then(() => {
                console.log("deleted")
            })
            let uploadRef = ref(storage, "users/" + uid + "/packages/" + pkg.id + "/img/one/" + imgUpload0ne.name)
            await uploadBytes(uploadRef, imgUpload0ne).then(() => {
                console.log("img one uploaded")
            })
            screenOneUrl = await getDownloadURL(uploadRef)

        } else {
            screenOneUrl = pkg.screenshots[0]
        }
        if (imgUploadTwo !== null) {
            const imgRef = ref(storage, pkg.screenshots[1]);
            await deleteObject(imgRef).then(() => {
                console.log("deleted")
            })
            let uploadRef = ref(storage, "users/" + uid + "/packages/" + pkg.id + "/img/two/" + imgUploadTwo.name)
            await uploadBytes(uploadRef, imgUploadTwo).then(() => {
                console.log("img two uploaded")
            })
            screenTwoUrl = await getDownloadURL(uploadRef)
        } else {
            screenTwoUrl = pkg.screenshots[1]
        }
        if (imgUploadThree !== null) {
            const imgRef = ref(storage, pkg.screenshots[2]);
            await deleteObject(imgRef).then(() => {
                console.log("deleted")
            })
            let uploadRef = ref(storage, "users/" + uid + "/packages/" + pkg.id + "/img/three/" + imgUploadThree.name)
            await uploadBytes(uploadRef, imgUploadThree).then(() => {
                console.log("img three uploaded")
            })
            screenThreeUrl = await getDownloadURL(uploadRef)
        } else {
            screenThreeUrl = pkg.screenshots[2]
        }
        if (imgUploadFour !== null) {
            const imgRef = ref(storage, pkg.screenshots[3]);
            await deleteObject(imgRef).then(() => {
                console.log("deleted")
            })
            let uploadRef = ref(storage, "users/" + uid + "/packages/" + pkg.id + "/img/four/" + imgUploadFour.name)
            await uploadBytes(uploadRef, imgUploadFour).then(() => {
                console.log("img four uploaded")
            })
            screenFourUrl = await getDownloadURL(uploadRef)
        } else {
            screenFourUrl = pkg.screenshots[3]
        }
        if (pkgUpload !== null) {
            const pkgRef = ref(storage, pkg.package);
            await deleteObject(pkgRef).then(() => {
                console.log("deleted pkg")
            })
            let pkgUploadRef = ref(storage, "users/" + uid + "/packages/" + pkg.id + "/pkg/" + pkgUpload.name)
            await uploadBytes(pkgUploadRef, pkgUpload).then(() => {
                console.log("pkg uploaded")
            })
            pkgUrl = await getDownloadURL(pkgUploadRef)
            currentVer = document.getElementById("pkg-version-input").value
        } else {
            pkgUrl = pkg.package
            currentVer = pkg.current_version
        }

        await setDoc(doc(db, "packages", pkg.id), {
            banner: bannerUrl,
            screenshots: [screenOneUrl, screenTwoUrl, screenThreeUrl, screenFourUrl],
            description: profanityFilter(newDesc),
            package: pkgUrl,
            current_version: currentVer,
        }, {merge: true})
    }

    useLayoutEffect(() => {
        document.querySelector('.banner').style.setProperty("--banner_url", `url('${pkg.banner}')`);
    }, []);


    return (
        <>
            <>
                <Navbar/>
                <input type="file" id="banner-file" style={{display: "none"}}
                       onChange={(event) => setBannerUpload(event.target.files[0])}
                       required
                       accept=".jpeg,.webp, image/jpeg"
                />
                <div className="banner banner-edit" id="banner" onClick={() => {
                    document.getElementById("banner-file").addEventListener('change', function () {
                        var vals = this.value,
                            val = vals.length ? vals.split('\\').pop() : '';
                        let fileup = new File([this.files[0]], this.files[0].name, {type: this.files[0].type})
                        setBannerUpload(fileup)
                        console.log(fileup)
                        // document.getElementById('banner').src = URL.createObjectURL(fileup);
                        document.querySelector('.banner').style.setProperty("--banner_url", `url(${URL.createObjectURL(fileup)})`);
                    });
                    document.getElementById("banner-file").click()
                }}></div>
                <h2 className="package-title">{pkg.name}</h2>
                <h3 className="package-author">// BY <span
                    style={{color: "#F0EBBA", cursor: "pointer"}}>{pkg.owner_username}</span>
                </h3>
                <button className="package-download-btn" id="package-download-btn" onClick={async () => {
                    document.getElementById("package-download-btn").innerHTML = "SAVING.."
                    await saveChanges().then(() => {
                        document.getElementById("package-download-btn").innerHTML = "SAVED ✅"
                        setTimeout(() => {
                            navigate("/packages/" + pkg.id)
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
                <p className="package-screenshots-label"></p>
                <div className="package-screenshots" id="package-screenshots">
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
                        src={pkg.screenshots[0]}
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
                    />
                    <img
                        id="screenshot_two"
                        src={pkg.screenshots[1]}
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
                    /><br id="screenshotbreak"/>
                    <img
                        id="screenshot_three"
                        src={pkg.screenshots[2]}
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
                        src={pkg.screenshots[3]}
                        className="package-img package-img-edit"
                        style={{marginLeft: "5px"}}
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
                <p className="package-characteristics-label"></p>
                <div className="package-characteristics" id="package-characteristics">
                    <p style={{marginRight: "29px"}} id="package-char-p">
                        TOTAL SIZE: {Math.round(pkg.sizeMb * 10) / 10}MB<br/><input type='text' id='pkg-version-input'
                                                                                    className='pkg-version-input'
                                                                                    placeholder='NEW VERSION'
                                                                                    style={{display: "none"}}
                                                                                    value={newVer} onChange={e => {
                        setNewVer(e.target.value);
                        console.log("yup")
                    }}/><span
                        id="package-version" className="current-ver">CURRENT VERSION: {pkg.current_version}</span>
                        <input type="file" id="pkg-new-version" style={{display: "none"}} onChange={(event) => {
                            setPkgUpload(event.target.files[0])
                            console.log("pkg")
                            document.getElementById("file-input-icon").style.display = "none"
                            document.getElementById("upload-new-pkg-btn").innerHTML = document.getElementById("upload-new-pkg-btn").innerHTML.replace("UPLOAD PACKAGE", "✅ UPLOAD PACKAGE")

                        }} accept=".zip, application/zip" required/>
                        <label htmlFor="pkg-new-version" className="upload-new-pkg-btn"
                               id="upload-new-pkg-btn"><BiCloudUpload
                            className="file-input-icon" id="file-input-icon"></BiCloudUpload>UPLOAD PACKAGE</label>
                        <FcCancel className="revert-upload-pkg" id="revert-upload-pkg" onClick={() => {
                            if (document.getElementById("upload-new-pkg-btn").innerHTML.includes("UPLOAD PACKAGE")) {
                                document.getElementById("package-version").innerHTML = "CURRENT VERSION: " + pkg.current_version
                                document.getElementById("upload-new-pkg-btn").style.display = "none"
                                document.getElementById("new-pkg-version-btn").style.display = "block"
                                document.getElementById("revert-upload-pkg").style.display = "none"
                                document.getElementById("package-char-p").style.marginRight = "29px"
                                document.getElementById("upload-new-pkg-btn").innerHTML = document.getElementById("upload-new-pkg-btn").innerHTML.replace("✅ UPLOAD PACKAGE", "UPLOAD PACKAGE")
                                // add the icon back
                                document.getElementById("file-input-icon").style.display = "revert"
                                document.getElementById("package-version").innerHTML = "CURRENT VERSION: " + pkg.current_version
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
                        <button className="delete-pkg-btn" id="delete-pkg-btn" onClick={async () => {
                            const delete_btn_content = document.getElementById("delete-pkg-btn").innerHTML
                            if (delete_btn_content === "DELETE PACKAGE") {
                                document.getElementById("delete-pkg-btn").innerHTML = "CONFIRM (3)"
                            } else if (delete_btn_content === "CONFIRM (3)") {
                                document.getElementById("delete-pkg-btn").innerHTML = "CONFIRM (2)"
                            } else if (delete_btn_content === "CONFIRM (2)") {
                                document.getElementById("delete-pkg-btn").innerHTML = "CONFIRM (1)"
                            } else if (delete_btn_content === "CONFIRM (1)") {
                                document.getElementById("delete-pkg-btn").innerHTML = "CONFIRM (!)"
                            } else if (delete_btn_content === "CONFIRM (!)") {
                                document.getElementById("delete-pkg-btn").innerHTML = "DELETING..."
                                // get the ref of every package screenshot and the ref of the package itself
                                const bannerRef = ref(storage, pkg.banner);
                                await deleteObject(bannerRef).then(() => {
                                    console.log("deleted")
                                })
                                const imgOneRef = ref(storage, pkg.screenshots[0]);
                                await deleteObject(imgOneRef).then(() => {
                                    console.log("deleted")
                                })

                                const imgTwoRef = ref(storage, pkg.screenshots[1]);
                                await deleteObject(imgTwoRef).then(() => {
                                    console.log("deleted")
                                })

                                const imgThreeRef = ref(storage, pkg.screenshots[2]);
                                await deleteObject(imgThreeRef).then(() => {
                                    console.log("deleted")
                                })

                                const imgFourRef = ref(storage, pkg.screenshots[3]);
                                await deleteObject(imgFourRef).then(() => {
                                    console.log("deleted")
                                })

                                const pkgRef = ref(storage, pkg.package);
                                await deleteObject(pkgRef).then(() => {
                                    console.log("deleted pkg")
                                })
                                // remove the package from owned_packages
                                const userRef = doc(db, "users", uid)
                                // remove this package from the user's owned_packages
                                await getDoc(doc(db, "users", uid)).then(async (doc) => {
                                    if (doc.exists()) {
                                        const data = doc.data()
                                        let owned_packages = data.owned_packages
                                        owned_packages.splice(owned_packages.indexOf(pkg.id), 1)
                                        await setDoc(userRef, {
                                            owned_packages: owned_packages
                                        }, {merge: true}).then(() => {
                                            console.log("removed pkg from owned_packages")
                                        })
                                    }
                                })
                                // delete the package from the database
                                await deleteDoc(doc(db, "packages", pkg.id)).then(() => {
                                    console.log("deleted pkg from db")
                                }).then(() => {
                                    navigate("/packages")
                                    window.location.reload()
                                })

                            }
                        }}>DELETE PACKAGE
                        </button>
                    </p>
                </div>
                <div className="bottom-block"></div>
            </>

        </>
    )

}