import "./packagePage.css"
import {onAuthStateChanged} from "firebase/auth";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {auth, db, storage, user_data} from "./firebase.js";
import React, {useEffect, useState} from "react";
import {getDownloadURL, ref} from "firebase/storage";
import {Link, useNavigate, useParams} from "react-router-dom";
import shortNumber from "short-number";
import fancy_name_to_id from "./utility.js";
import MDEditor from '@uiw/react-md-editor';
import Popup from "reactjs-popup";

export default function PackagePage() {
    const [pkg, setPkg] = useState(null);

    const [uid, set_uid] = useState("");
    let baseStyle = {}
    const navigate = useNavigate();

    const [is_logged_in, set_is_logged_in] = useState(false);
    const [new_downloads, set_new_downloads] = useState(0);


    function downloadPkg() {
        // if (!is_logged_in) {
        //     navigate("/sign-in")
        // }
        let pkgRef = ref(storage, pkg.package);
        getDownloadURL(pkgRef).then((url) => {
            window.location.assign(url);
            if (is_logged_in) {
                getDoc(doc(db, "packages", pkg.id)).then((doc) => {
                    if (doc.exists()) {
                        set_new_downloads(doc.data().downloads);
                    } else {
                        set_new_downloads(-1);
                    }
                })
                if (!user_data.downloadpkg.includes(pkg.id)) {
                    updateDoc(doc(db, "users", uid), {
                        downloadpkg: [...user_data.downloadpkg, pkg.id]
                    })
                }
                if (new_downloads !== -1) {
                    updateDoc(doc(db, "packages", pkg.id), {
                        downloads: new_downloads + 1
                    }).then(r => {
                        console.log("updated");
                    });
                }

            }
        })
    }


    onAuthStateChanged(auth, (user) => {
        if (user && pkg !== null) {
            set_is_logged_in(true);
            set_uid(user.uid)
            console.log("PKG: " + pkg.owner_id)
            console.log("UID: " + uid)
            if (uid === pkg.owner_id) {
                document.getElementById("package-download-btn").innerHTML = "EDIT"
                document.getElementById("package-download-btn").classList.add("package-edit-btn")
                // document.getElementById("package-download-btn").style.backgroundColor = "#F0EBBA"
                // // fix the text not being centered
                // document.getElementById("package-download-btn").style.paddingLeft = "30px"
                // document.getElementById("package-download-btn").style.paddingRight = "30px"
                // document.getElementById("package-download-btn").style.paddingTop = "15px"
                // document.getElementById("package-download-btn").style.paddingBottom = "15px"
                // // fix the margins
                // document.getElementById("package-download-btn").style.right = "15px"
                // document.getElementById("package-download-btn").style.bottom = "15px"
                // // change transform origin
                // document.getElementById("package-download-btn").style.transformOrigin = "bottom right"
                // document.getElementById("package-download-btn").style.color = "#000000"
                // document.getElementById("package-download-btn").style.border = "none"
                // document.getElementById("package-download-btn").style.cursor = "pointer"
                document.getElementById("package-download-btn").onclick = () => {
                    navigate("/packages/" + pkg.id + "/edit", {state: {pkg: pkg}})
                }
                document.getElementById("package-download-side").style.display = "block"
            }
        } else {
            set_is_logged_in(false);
        }
    });

    const params_id = useParams().id;
    useEffect(() => {
        // document.getElementById("body").style.backgroundImage = "none"
        // document.getElementById("root").style.backgroundImage = "none"
        if (pkg === null) {
            getDoc(doc(db, "packages", params_id)).then((doc) => {
                if (doc.exists()) {
                    setPkg(doc.data());
                    console.log("pkg: ", pkg)

                } else {
                    const navigate = useNavigate();
                    navigate("/packages")
                }
            })
        }
        if (pkg !== null) {
            console.log("use effect is run")
            document.title = pkg.name + " - DEVSHOP"
            console.log("package banner load: " + pkg.banner)
            document.querySelector('.banner').style.setProperty("--banner_url", `url('${pkg.banner}')`);
            // get the length of the ratings map
            let ratings_length = Object.keys(pkg.ratings).length;

            if (ratings_length === 0) {
                document.getElementById("happiness_num").innerHTML = "NaN"
                document.getElementById("review_num").innerHTML = "0"
            } else {
                if (ratings_length === 1) {
                    document.getElementById("review_num_plural").innerHTML = "rating"
                }
                document.getElementById("review_num").innerHTML = ratings_length
                let ratings = pkg.ratings;
                // set ratings as an array of all the ratings numbers
                ratings = Object.values(ratings);
                let sum = 0;
                for (let i = 0; i < ratings.length; i++) {
                    sum += parseInt(ratings[i]);
                }
                let avg = (sum / ratings.length).toFixed(1)
                if (parseInt(avg) === 100) {
                    document.getElementById("happiness_num").innerHTML = "100"
                } else {
                    if (avg.length === 3) {
                        avg = "0" + avg
                    }

                    document.getElementById("happiness_num").innerHTML = avg
                }
            }

            baseStyle = document.getElementById("screenshot_one").style
        }
    }, [pkg]);


    function fullScreen(img) {
        document.getElementById("screenshot_bg_div").style.display = "flex";
        document.getElementById("screenshot-bg-div-img").src = img.src;
        console.log("full screen shown")
        document.getElementById("screenshot-bg-div-img").classList.add("full-img-shown")
    }

    if (pkg === null) {
        return <></>
    }

    return (
        <>
            <div className="screenshot_bg_div" id="screenshot_bg_div" onClick={() => {
                document.getElementById("screenshot-bg-div-img").classList.remove("full-img-shown")

                const revertChanges = img => {
                    img.style = baseStyle;
                    if (img.id === "screenshot_two" || img.id === "screenshot_four") {
                        img.style.marginLeft = "5px"
                    }

                }
                let img = document.getElementById("screenshot_one");
                revertChanges(img);
                img = document.getElementById("screenshot_two");
                revertChanges(img);
                img = document.getElementById("screenshot_three");
                revertChanges(img);
                img = document.getElementById("screenshot_four");
                revertChanges(img);
                document.getElementById("screenshot_bg_div").style.display = "none";
            }}>
                <img id="screenshot-bg-div-img" alt="Full screen image of the package"/>
            </div>
            <div className="banner"></div>
            <h2 className="package-title">{pkg.name}</h2>
            <h3 className="package-author">// BY <Link className="package-author-link"
                                                       to={"/users/" + fancy_name_to_id(pkg.owner_username)}>{pkg.owner_username}</Link>
            </h3>
            <button className="package-download-btn" id="package-download-btn"
                    onClick={() => downloadPkg()}>{"DOWNLOAD -> 0$"}</button>
            <p className="package-description-label">// 01 - DESCRIPTION</p>
            <p className="package-description">{
                <MDEditor.Markdown source={pkg.description} className="package-desc-md"/>
            }</p>
            <p className="package-screenshots-label"></p>
            <div className="package-screenshots" id="package-screenshots">
                <img
                    id="screenshot_one"
                    src={pkg.screenshots[0]}
                    className="package-img"
                    alt="First screenshot" onClick={() => {
                    // animate the image to full screen
                    let img = document.getElementById("screenshot_one");
                    fullScreen(img);
                }}/>
                <img
                    id="screenshot_two"
                    src={pkg.screenshots[1]}
                    className="package-img"
                    style={{marginLeft: "5px"}}
                    alt="Second screenshot" onClick={() => {
                    // animate the image to full screen
                    let img = document.getElementById("screenshot_two");
                    fullScreen(img);
                }}
                /><br id="screenshotbreak"/>
                <img
                    id="screenshot_three"
                    src={pkg.screenshots[2]}
                    className="package-img"
                    alt="Third screenshot" onClick={() => {
                    // animate the image to full screen
                    let img = document.getElementById("screenshot_three");
                    fullScreen(img);
                }}
                />
                <img
                    id="screenshot_four"
                    src={pkg.screenshots[3]}
                    className="package-img"
                    style={{marginLeft: "5px"}}
                    alt="Fourth screenshot" onClick={() => {
                    // animate the image to full screen
                    let img = document.getElementById("screenshot_four");
                    fullScreen(img);
                }}
                />
            </div>
            <p className="package-characteristics-label"></p>
            <div className="package-characteristics">
                <p>DOWNLOADS: {shortNumber(pkg.downloads)}<br/>AVERAGE HAPPINESS: <span
                    id="happiness_num">xx.x</span><br/>↳ <span id="review_num">5</span> <span
                    id="review_num_plural">ratings</span>

                    <span id="rate_btn"><br/>↳

                       <Popup trigger={<span className="rate_btn">{">> RATE THIS <<"}</span>} modal>
                           <h3 className="rating-popup-title">RATE THIS PACKAGE</h3>
                           <span className="rating-popup-input">RATING: <input type='number' max='100' min='0'
                                                                               maxLength='3' className='rating_input'
                                                                               id='rating_input' onInput={() => {
                               if (document.getElementById("rating_input").value > 100) {
                                   document.getElementById("rating_input").value = 100
                               } else if (document.getElementById("rating_input").value < 0) {
                                   document.getElementById("rating_input").value = 0
                               }
                           }}/> /100</span>
                           <br/><br/>
                           <button className='secondary rating-popup-btn' id='rating_done_btn' onClick={async () => {
                               // if no map exists on the package firebase doc, create one and add the rating, else add the rating to the map
                               await updateDoc(doc(db, "packages", pkg.id), {
                                   // get all existing ratings of the package using the pkg object, and add the new rating to the map
                                   ratings: {
                                       ...pkg.ratings,
                                       [uid]: document.getElementById("rating_input").value
                                   }
                               }).then(() => {
                                   // reload the page to update the rating
                                   window.location.reload();
                               })
                           }}>SUBMIT</button>

                       </Popup>




                    </span>

                    <br/>
                    DISK SIZE: {Math.round(pkg.sizeMb * 10) / 10}MB<br/><span className="current-ver">
                        VERSION: {pkg.current_version}</span><br/>
                    <button className="package-download-side" id="package-download-side"
                            onClick={() => downloadPkg()}>DOWNLOAD
                    </button>
                </p>
            </div>
            <div className="bottom-block"></div>
        </>
    )
}