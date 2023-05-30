import './packagePage.css'
import "./editPackage.css"
import {onAuthStateChanged} from "firebase/auth";
import {auth} from "./firebase.js";
import fancy_name_to_id from "./utility.js";
import {useNavigate} from "react-router-dom";
import Navbar from "./Navbar.jsx";
import MDEditor from "@uiw/react-md-editor";
import React, {useState} from "react";

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
                <button className="package-download-btn" id="package-download-btn" onClick={() => {
                    // download pkg
                    if (uid !== "") {
                        navigate("/packages/" + fancy_name_to_id(pkg.name))
                    }

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
                           onChange={(event) => setImgUploadOne(event.target.files[0])} required
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
                    <label
                        id="screenshot_one"
                        style={{backgroundImage: "url('" + pkg.screenshots[0] + "')"}}
                        className="package-img package-img-edit"/>
                    <img
                        id="screenshot_two"
                        src={pkg.screenshots[1]}
                        className="package-img package-img-edit"
                        style={{marginLeft: "5px"}}
                        alt="Second screenshot"
                    /><br id="screenshotbreak"/>
                    <img
                        id="screenshot_three"
                        src={pkg.screenshots[2]}
                        className="package-img package-img-edit"
                        alt="Third screenshot"
                    />
                    <img
                        id="screenshot_four"
                        src={pkg.screenshots[3]}
                        className="package-img package-img-edit"
                        style={{marginLeft: "5px"}}
                        alt="Fourth screenshot"
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