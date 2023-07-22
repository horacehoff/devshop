import "./packagePage.css"
import "./codeBlockPage.css"
import {onAuthStateChanged} from "firebase/auth";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {auth, db} from "./firebase.js";
import React, {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import shortNumber from "short-number";
import fancy_name_to_id from "./utility.js";
import MDEditor from '@uiw/react-md-editor';
import Popup from "reactjs-popup";

export default function CodeBlockPage() {
    const [codeBlock, setCodeBlock] = useState(null);
    const [uid, set_uid] = useState("");
    const [is_logged_in, set_is_logged_in] = useState(false);
    let baseStyle = {}
    const navigate = useNavigate();

    const [new_downloads, set_new_downloads] = useState(0);

    let popupRef = React.createRef();


    function downloadCode() {
        let element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(codeBlock.code));
        element.setAttribute('download', codeBlock.name + "-" + codeBlock.current_version + ".txt");

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }



    onAuthStateChanged(auth, (user) => {
        if (user && codeBlock !== null) {
            set_uid(user.uid)
            set_is_logged_in(true)
            if (uid === codeBlock.owner_id) {
                document.getElementById("package-download-btn").innerHTML = "EDIT"
                document.getElementById("package-download-btn").classList.add("package-edit-btn")
                document.getElementById("package-download-side").style.display = "block"
            }
        } else {
            set_is_logged_in(false)
        }
    });

    const params_id = useParams().id;
    useEffect(() => {
        if (codeBlock === null) {
            getDoc(doc(db, "code-blocks", params_id)).then((doc) => {
                if (doc.exists()) {
                    setCodeBlock(doc.data());
                    console.log("pkg: ", codeBlock)

                } else {
                    const navigate = useNavigate();
                    navigate("/packages")
                }
            })
        }
        if (codeBlock !== null) {
            console.log("use effect is run")
            document.title = codeBlock.name + " - DEVSHOP"
            console.log("package banner load: " + codeBlock.banner)
            // document.querySelector('.banner').style.setProperty("--banner_url", `url('${codeBlock.banner}')`);
            // get the length of the ratings map
            let ratings_length = Object.keys(codeBlock.ratings).length;

            if (ratings_length === 0) {
                document.getElementById("happiness_num").innerHTML = "NaN"
                document.getElementById("review_num").innerHTML = "0"
            } else {
                if (ratings_length === 1) {
                    document.getElementById("review_num_plural").innerHTML = "rating"
                }
                document.getElementById("review_num").innerHTML = ratings_length
                let ratings = codeBlock.ratings;
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
    }, [codeBlock]);


    function fullScreen(img) {
        document.getElementById("screenshot_bg_div").style.display = "flex";
        document.getElementById("screenshot-bg-div-img").src = img.src;
        console.log("full screen shown")
        document.getElementById("screenshot-bg-div-img").classList.add("full-img-shown")
    }

    if (codeBlock === null) {
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
            <div className="package-screenshots code-screenshots" id="package-screenshots">
                <img
                    id="screenshot_one"
                    src={codeBlock.screenshots[0]}
                    className="package-img code-img"
                    alt="First screenshot" onClick={() => {
                    // animate the image to full screen
                    let img = document.getElementById("screenshot_one");
                    fullScreen(img);
                }}/>
                <img
                    id="screenshot_two"
                    src={codeBlock.screenshots[1]}
                    className="package-img code-img"
                    style={{marginLeft: "5px"}}
                    alt="Second screenshot" onClick={() => {
                    // animate the image to full screen
                    let img = document.getElementById("screenshot_two");
                    fullScreen(img);
                }}
                /><br id="codescreenshotbreak"/>
                <img
                    id="screenshot_three"
                    src={codeBlock.screenshots[2]}
                    className="package-img code-img"
                    alt="Third screenshot" onClick={() => {
                    // animate the image to full screen
                    let img = document.getElementById("screenshot_three");
                    fullScreen(img);
                }}
                />
                <img
                    id="screenshot_four"
                    src={codeBlock.screenshots[3]}
                    className="package-img code-img"
                    style={{marginLeft: "5px"}}
                    alt="Fourth screenshot" onClick={() => {
                    // animate the image to full screen
                    let img = document.getElementById("screenshot_four");
                    fullScreen(img);
                }}
                />
                <br/>
            </div>
            <h2 className="package-title code-block-title">{codeBlock.name}</h2>
            <h3 className="package-author">// BY <Link className="package-author-link"
                                                       to={"/users/" + fancy_name_to_id(codeBlock.owner_username)}>{codeBlock.owner_username}</Link>
            </h3>
            <button className="package-download-btn" id="package-download-btn"
                    onClick={() => {
                        if (uid === codeBlock.owner_id) {
                            navigate("/codeblocks/" + codeBlock.id + "/edit", {state: {pkg: codeBlock}})
                        } else {
                            downloadCode()
                        }
                    }
                    }>{"DOWNLOAD -> 0$"}</button>
            <p className="package-description-label">// 01 - DESCRIPTION</p>
            <p className="package-description">{
                <MDEditor.Markdown source={codeBlock.description} className="package-desc-md"/>
            }</p>

            <button className="code-forward-btn" id="code-forward-btn" onClick={() => {
                if (document.getElementById("code-forward-btn").innerText === "<<") {
                    document.getElementById("screenshot_one").scrollIntoView({behavior: "smooth", block: "center"})
                    document.getElementById("code-forward-btn").innerText = ">>"
                } else {
                    document.getElementById("screenshot_four").scrollIntoView({behavior: "smooth", block: "center"})
                    document.getElementById("code-forward-btn").innerText = "<<"
                }
            }}>{">>"}</button>
            <p className="package-characteristics-label code-characteristics-label"></p>
            <div className="package-characteristics code-characteristics">
                <p>TOTAL DOWNLOADS: {shortNumber(codeBlock.downloads)}<br/>{codeBlock.lines} LINES OF CODE<br/>AVERAGE
                    HAPPINESS: <span
                        id="happiness_num">xx.x</span><br/>↳ <span id="review_num">5</span> <span
                        id="review_num_plural">ratings</span>

                    <span id="rate_btn"><br/>↳<Popup trigger={<span className="rate_btn">{">> RATE THIS <<"}</span>}
                                                     modal id="rating-popup"
                                                     ref={popupRef} onOpen={() => {
                        if (!is_logged_in) {
                            document.getElementById("popup-root").firstChild.firstChild.innerHTML = '<h4>WARNING</h4><p class="popup-signin-txt">You need to sign in to be able to rate code blocks.</p><button class="secondary popup-signin-btn" id="popup-sign-in">SIGN_IN</button><button class="primary popup-back-btn" id="popup-go-back">GO BACK</button>'
                            document.getElementById("popup-sign-in").onclick = () => {
                                navigate("/sign-in")
                            }
                            document.getElementById("popup-go-back").onclick = () => {
                                popupRef.current.close()
                            }
                        }
                    }}>
                           <h3 className="rating-popup-title">RATE THIS PACKAGE</h3>
                           <span className="rating-popup-input">RATING: <input type='number' max='100' min='0'
                                                                               maxLength='3' className='rating_input'
                                                                               id='rating_input' onInput={() => {
                               console.log(is_logged_in)
                               if (document.getElementById("rating_input").value > 100) {
                                   document.getElementById("rating_input").value = 100
                               } else if (document.getElementById("rating_input").value < 0) {
                                   document.getElementById("rating_input").value = 0
                               }
                           }}/> /100</span>
                           <br/><br/>
                           <button className='secondary rating-popup-btn' id='rating_done_btn' onClick={async () => {
                               // if no map exists on the package firebase doc, create one and add the rating, else add the rating to the map
                               await updateDoc(doc(db, "code-blocks", codeBlock.id), {
                                   // get all existing ratings of the package using the pkg object, and add the new rating to the map
                                   ratings: {
                                       ...codeBlock.ratings,
                                       [uid]: document.getElementById("rating_input").value
                                   }
                               }).then(() => {
                                   // reload the page to update the rating
                                   window.location.reload();
                               })
                           }}>SUBMIT</button>

                       </Popup></span>

                    <br/><span className="current-ver">CURRENT
                        VERSION: {codeBlock.current_version}</span><br/>
                    <button className="package-download-side" id="package-download-side"
                            onClick={() => downloadCode()}>DOWNLOAD
                    </button>
                </p>
            </div>
            <div className="bottom-block"></div>
        </>
    )
}