import './packagePage.css'
import "./editPackage.css"
import {onAuthStateChanged} from "firebase/auth";
import {auth, db} from "./firebase.js";
import fancy_name_to_id from "./utility.js";
import {useNavigate} from "react-router-dom";
import Navbar from "./Navbar.jsx";
import MDEditor from "@uiw/react-md-editor";
import React, {useState} from "react";
import {deleteObject, getDownloadURL, getStorage, ref, uploadBytes} from "firebase/storage";
import {doc, setDoc} from "firebase/firestore";

export default function EditPackage(props) {
    const pkg = props.pkg
    const navigate = useNavigate()
    let uid = "";
    const [newDesc, setNewDesc] = useState(pkg.description)

    const [imgUpload0ne, setImgUploadOne] = useState(null);
    const [imgUploadTwo, setImgUploadTwo] = useState(null);
    const [imgUploadThree, setImgUploadThree] = useState(null);
    const [imgUploadFour, setImgUploadFour] = useState(null);


    onAuthStateChanged(auth, (user) => {
        if (user) {
            // check if user id is the package owner_id
            if (user.uid === pkg.owner_id) {
                console.log("user is owner")
                uid = user.uid;
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
        const storage = getStorage();
        let screenOneUrl = ""
        let screenTwoUrl = ""
        let screenThreeUrl = ""
        let screenFourUrl = ""

        if (imgUpload0ne !== null) {
            const imgRef = ref(storage, pkg.screenshots[0]);
            await deleteObject(imgRef).then(() => {
                console.log("deleted")
            })
            let uploadRef = ref(storage, "users/" + uid + "/" + fancy_name_to_id(pkg.name) + "/img/" + (imgUpload0ne.name ?? ("screenone" + imgUpload0ne.type)))
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
            let uploadRef = ref(storage, "users/" + uid + "/" + fancy_name_to_id(pkg.name) + "/img/" + (imgUploadTwo.name ?? ("screentwo" + imgUploadTwo.type)))
            await uploadBytes(uploadRef, imgUpload0ne).then(() => {
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
            let uploadRef = ref(storage, "users/" + uid + "/" + fancy_name_to_id(pkg.name) + "/img/" + (imgUploadThree.name ?? ("screenthree" + imgUploadThree.type)))
            await uploadBytes(uploadRef, imgUpload0ne).then(() => {
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
            let uploadRef = ref(storage, "users/" + uid + "/" + fancy_name_to_id(pkg.name) + "/img/" + (imgUploadFour.name ?? ("screenfour" + imgUploadFour.type)))
            await uploadBytes(uploadRef, imgUpload0ne).then(() => {
                console.log("img four uploaded")
            })
            screenFourUrl = await getDownloadURL(uploadRef)
        } else {
            screenFourUrl = pkg.screenshots[3]
        }

        await setDoc(doc(db, "packages", fancy_name_to_id(pkg.name)), {
            screenshots: [screenOneUrl, screenTwoUrl, screenThreeUrl, screenFourUrl],
        }, {merge: true})
    }


    return (
        <>
            <>
                <Navbar/>
                <div className="banner banner-edit" onLoad={() => {
                    document.querySelector('.banner').style.setProperty("--banner_url", `url(${pkg.banner})`);
                }}></div>
                <h2 className="package-title">{pkg.name}</h2>
                <h3 className="package-author">// BY <span
                    style={{color: "#F0EBBA", cursor: "pointer"}}>{pkg.owner_username}</span>
                </h3>
                <button className="package-download-btn" id="package-download-btn" onClick={async () => {
                    await saveChanges()

                    // if (uid !== "") {
                    //     navigate("/packages/" + fancy_name_to_id(pkg.name))
                    // }

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
                        style={{backgroundImage: "url('" + pkg.screenshots[0] + "')"}}
                        className="package-img package-img-edit"
                        onClick={() => {
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
                            document.getElementById("img-file-two").click()
                            document.getElementById("img-file-two").addEventListener('change', function () {
                                var vals = this.value,
                                    val = vals.length ? vals.split('\\').pop() : '';
                                setImgUploadTwo(val)
                                console.log(val)
                                // set this image as this image src
                                document.getElementById('screenshot_two').src = val;
                            });
                        }}
                    /><br id="screenshotbreak"/>
                    <img
                        id="screenshot_three"
                        src={pkg.screenshots[2]}
                        className="package-img package-img-edit"
                        alt="Third screenshot"
                        onClick={() => {
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
                            document.getElementById("img-file-four").click()
                        }}
                    />
                </div>
                <p className="package-characteristics-label"></p>
                <div className="package-characteristics">
                    <p style={{paddingRight: "18px"}}>
                        TOTAL SIZE: {Math.round(pkg.sizeMb * 10) / 10}MB<br/>CURRENT VERSION: {pkg.current_version}
                    </p>
                </div>
                <div className="bottom-block"></div>
            </>

        </>
    )

}