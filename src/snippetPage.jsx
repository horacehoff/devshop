import "./packagePage.css"
import "./snippetPage.css"
import {onAuthStateChanged} from "firebase/auth";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {auth, db, user_data} from "./firebase.js";
import React, {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import shortNumber from "short-number";
import fancy_name_to_id from "./utility.js";
import MDEditor from '@uiw/react-md-editor';
import Popup from "reactjs-popup";

export default function SnippetPage() {
    const [snippet, setCodeBlock] = useState(null);
    const [uid, set_uid] = useState("");
    const [is_logged_in, set_is_logged_in] = useState(false);
    let baseStyle = {}
    const navigate = useNavigate();

    const [new_downloads, set_new_downloads] = useState(0);

    const [mobile, setMobile] = useState(false)


    let popupRef = React.createRef();


    function downloadCode() {
        let element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(snippet.code));
        element.setAttribute('download', snippet.name + "-" + snippet.current_version + ".txt");

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);

        if (is_logged_in) {
            if (!user_data.pkgdownloads.includes(snippet.id)) {
                updateDoc(doc(db, "snippets", snippet.id), {
                    downloads: [...snippet.downloads, uid]
                })
                updateDoc(doc(db, "users", uid), {
                    codedownloads: [...user_data.codedownloads, snippet.id]
                })
            }
        }
    }


    onAuthStateChanged(auth, (user) => {
        if (user && snippet !== null) {
            set_uid(user.uid)
            set_is_logged_in(true)
            if (uid === snippet.owner_id) {
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
        if (snippet === null) {
            getDoc(doc(db, "snippets", params_id)).then((doc) => {
                if (doc.exists()) {
                    setCodeBlock(doc.data());
                    console.log("pkg: ", snippet)

                } else {
                    const navigate = useNavigate();
                    navigate("/packages")
                }
            })
        }
        if (snippet !== null) {
            setMobile(window.matchMedia("(pointer: fine) and (hover: hover)").matches)


            console.log("use effect is run")
            document.title = snippet.name + " - DEVSHOP"
            console.log("package banner load: " + snippet.banner)
            // document.querySelector('.banner').style.setProperty("--banner_url", `url('${snippet.banner}')`);
            // get the length of the ratings map
            let ratings_length = Object.keys(snippet.ratings).length;

            if (ratings_length === 0) {
                document.getElementById("happiness_num").innerHTML = "NaN"
                document.getElementById("review_num").innerHTML = "0"
            } else {
                if (ratings_length === 1) {
                    document.getElementById("review_num_plural").innerHTML = "rating"
                }
                document.getElementById("review_num").innerHTML = ratings_length
                let ratings = snippet.ratings;
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

            if (user_data) {
                if (user_data.codedownloads.includes(snippet.id)) {
                    document.getElementById("package-download-side").style.borderBottomLeftRadius = "0px"
                    document.getElementById("package-download-side").style.borderBottomRightRadius = "0px"
                    document.getElementById("package-rate-btn").style.display = "inline-block"
                }
            }

            baseStyle = document.getElementById("screenshot_one").style
            let screenshots = document.getElementById("package-screenshots")
            let screenshots_dist = screenshots.scrollWidth - screenshots.offsetWidth
            let scroll_indicator = document.getElementById("code-forward-btn")
            screenshots.addEventListener("scrollend", (event) => {
                if (screenshots.scrollLeft === screenshots_dist) {
                    scroll_indicator.innerText = "<<"
                } else {
                    scroll_indicator.innerText = ">>"
                }
            })
        }

    }, [snippet]);

    if (snippet === null) {
        return <></>
    }


    return (
        <>
            <div className="full-screen-img" id="full-screen" onClick={() => {
                document.getElementById("full-screen-img").style.scale = "0.5"
                document.getElementById("full-screen").style.opacity = "0"
                document.getElementById("full-screen").style.zIndex = "-1"
                document.getElementById("full-screen-img").style.scale = "0.9"
            }}>
                <img src={snippet.screenshots[0]} id="full-screen-img" alt="full screen image"></img>
            </div>
            <div className="package-screenshots code-screenshots" id="package-screenshots">
                <img
                    id="screenshot_one"
                    src={snippet.screenshots[0]}
                    className="package-img code-img"
                    alt="First screenshot" onMouseEnter={() => {
                    document.getElementById("full-screen-img").src = snippet.screenshots[0]
                }} onClick={() => {
                    if (!mobile) {
                        console.log('click')
                        document.getElementById("full-screen-img").src = snippet.screenshots[0]
                    }
                    document.getElementById("full-screen").style.zIndex = "15"
                    document.getElementById("full-screen").style.opacity = "1"
                    document.getElementById("full-screen-img").style.scale = "1"
                }}/>
                <img
                    id="screenshot_two"
                    src={snippet.screenshots[1]}
                    className="package-img code-img"
                    alt="Second screenshot" onMouseEnter={() => {
                    document.getElementById("full-screen-img").src = snippet.screenshots[1]
                }} onClick={() => {
                    if (!mobile) {
                        document.getElementById("full-screen-img").src = snippet.screenshots[1]
                    }
                    document.getElementById("full-screen").style.zIndex = "15"
                    document.getElementById("full-screen").style.opacity = "1"
                    document.getElementById("full-screen-img").style.scale = "1"
                }}
                /><br id="codescreenshotbreak"/>
                <img
                    id="screenshot_three"
                    src={snippet.screenshots[2]}
                    className="package-img code-img"
                    alt="Third screenshot" onMouseEnter={() => {
                    document.getElementById("full-screen-img").src = snippet.screenshots[2]
                }} onClick={() => {
                    if (!mobile) {
                        document.getElementById("full-screen-img").src = snippet.screenshots[2]
                    }
                    document.getElementById("full-screen").style.zIndex = "15"
                    document.getElementById("full-screen").style.opacity = "1"
                    document.getElementById("full-screen-img").style.scale = "1"
                }}
                />
                <img
                    id="screenshot_four"
                    src={snippet.screenshots[3]}
                    className="package-img code-img"
                    alt="Fourth screenshot" onMouseEnter={() => {
                    document.getElementById("full-screen-img").src = snippet.screenshots[3]
                }} onClick={() => {
                    if (!mobile) {
                        document.getElementById("full-screen-img").src = snippet.screenshots[3]
                    }
                    document.getElementById("full-screen").style.zIndex = "15"
                    document.getElementById("full-screen").style.opacity = "1"
                    document.getElementById("full-screen-img").style.scale = "1"
                }}
                />
                <br/>
            </div>
            <h2 className="package-title snippet-title">{snippet.name}</h2>
            <h3 className="package-author">by <Link className="package-author-link"
                                                    to={"/users/" + fancy_name_to_id(snippet.owner_username)}>{snippet.owner_username}</Link>
            </h3>
            <button className="package-download-btn" id="package-download-btn"
                    onClick={() => {
                        if (uid === snippet.owner_id) {
                            navigate("/snippets/" + snippet.id + "/edit", {state: {pkg: snippet}})
                        } else {
                            downloadCode()
                        }
                    }
                    }>{"DOWNLOAD -> 0$"}</button>
            <p className="package-description-label">// 01 - DESCRIPTION</p>
            <div className="package-description">{
                <MDEditor.Markdown source={snippet.description} className="package-desc-md"/>
            }</div>

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
                <p>DOWNLOADS: {shortNumber(snippet.downloads.length)}<br/>{snippet.lines} LINE(S) OF CODE<br/>AVERAGE
                    HAPPINESS: <span
                        id="happiness_num">xx.x</span><br/>↳ <span id="review_num">5</span> <span
                        id="review_num_plural">ratings</span>

                    <br/><span className="current-ver">CURRENT
                        VERSION: {snippet.current_version}</span><br/>
                    <button className="package-download-side pkg-side-dwnl" id="package-download-side"
                            onClick={() => downloadCode()}>DOWNLOAD
                    </button>
                    <Popup trigger={
                        <button className="secondary package-rate-btn"
                                onClick={() => {
                                }} id="package-rate-btn">RATE SNIPPET</button>
                    } modal id="rating-popup"
                           ref={popupRef} onOpen={() => {
                        if (!is_logged_in) {
                            document.getElementById("popup-root").firstChild.firstChild.innerHTML = '<h4>⚠️</h4><p class="popup-signin-txt">You need to sign in to be able to rate snippets.</p><button class="secondary popup-signin-btn" id="popup-sign-in">SIGN_IN</button>'
                            document.getElementById("popup-sign-in").onclick = () => {
                                navigate("/sign-in")
                            }
                            document.getElementById("popup-go-back").onclick = () => {
                                popupRef.current.close()
                            }
                        }
                    }}>
                        <h3 className="rating-popup-title">&nbsp;&nbsp;RATE THIS SNIPPET&nbsp;&nbsp;</h3>
                        <span className="rating-popup-input"><input type='number' max='100' min='0'
                                                                    maxLength='3' className='rating_input'
                                                                    id='rating_input' onInput={() => {
                            console.log(is_logged_in)
                            if (document.getElementById("rating_input").value > 100) {
                                document.getElementById("rating_input").value = 100
                            } else if (document.getElementById("rating_input").value < 0) {
                                document.getElementById("rating_input").value = 0
                            }
                        }}/>&nbsp;/100</span>
                        <br/>
                        <button className='secondary rating-popup-btn' id='rating_done_btn' onClick={async () => {
                            // if no map exists on the package firebase doc, create one and add the rating, else add the rating to the map
                            await updateDoc(doc(db, "snippets", snippet.id), {
                                // get all existing ratings of the package using the pkg object, and add the new rating to the map
                                ratings: {
                                    ...snippet.ratings,
                                    [uid]: document.getElementById("rating_input").value
                                }
                            }).then(() => {
                                // reload the page to update the rating
                                window.location.reload();
                            })
                        }}>SUBMIT
                        </button>

                    </Popup>
                </p>
            </div>
            {/*<div className="bottom-block"></div>*/}
        </>
    )
}