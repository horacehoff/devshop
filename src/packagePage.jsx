import "./packagePage.css"
import {onAuthStateChanged} from "firebase/auth";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {auth, db, storage, user_data} from "./firebase.js";
import {createRef, useEffect, useState} from "react";
import {getDownloadURL, ref} from "firebase/storage";
import {Link, useNavigate, useParams} from "react-router-dom";
import shortNumber from "short-number";
import fancy_name_to_id from "./utility.js";
import MDEditor from '@uiw/react-md-editor';
import Popup from "reactjs-popup";
import "./popup.css"

export default function PackagePage() {
    const [pkg, setPkg] = useState(null);

    const [uid, set_uid] = useState("");
    let baseStyle = {}
    const navigate = useNavigate();

    const [is_logged_in, set_is_logged_in] = useState(false);
    const [new_downloads, set_new_downloads] = useState(0);
    const [mobile, setMobile] = useState(false)

    let popupRef = createRef(null);


    function downloadPkg() {
        let pkgRef = ref(storage, pkg.package);
        getDownloadURL(pkgRef).then((url) => {
            window.location.assign(url);
            if (is_logged_in) {
                if (!user_data.pkgdownloads.includes(pkg.id)) {
                    updateDoc(doc(db, "packages", pkg.id), {
                        downloads: [...pkg.downloads, uid]
                    })
                    updateDoc(doc(db, "users", uid), {
                        pkgdownloads: [...user_data.pkgdownloads, pkg.id]
                    })
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
            setMobile(window.matchMedia("(pointer: fine) and (hover: hover)").matches)

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
            if (user_data) {
                if (user_data.pkgdownloads.includes(pkg.id)) {
                    document.getElementById("package-download-side").style.borderBottomLeftRadius = "0px"
                    document.getElementById("package-download-side").style.borderBottomRightRadius = "0px"
                    document.getElementById("package-rate-btn").style.display = "inline-block"
                }
            }

            baseStyle = document.getElementById("screenshot_one").style
        }
    }, [pkg]);

    if (pkg === null) {
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
                <img src={pkg.screenshots[0]} id="full-screen-img" alt="full screen image"></img>
            </div>
            <div className="banner" onMouseEnter={() => {
                document.getElementById("full-screen-img").src = pkg.banner
            }} onClick={() => {
                if (!mobile) {
                    console.log('click')
                    document.getElementById("full-screen-img").src = pkg.banner
                }
                document.getElementById("full-screen").style.zIndex = "15"
                document.getElementById("full-screen").style.opacity = "1"
                document.getElementById("full-screen-img").style.scale = "1"
            }}></div>
            {/*<div className="banner-blur"></div>*/}
            <h2 className="package-title">{pkg.name}</h2>
            <h3 className="package-author">by <Link className="package-author-link"
                                                    to={"/users/" + fancy_name_to_id(pkg.owner_username)}>{pkg.owner_username}</Link>
            </h3>
            <button className="package-download-btn" id="package-download-btn"
                    onClick={() => downloadPkg()}>{"DOWNLOAD -> 0$"}</button>
            <p className="package-description-label">// 01 - DESCRIPTION</p>
            <div className="package-description">{
                <MDEditor.Markdown source={pkg.description} className="package-desc-md"/>
            }</div>
            <p className="package-screenshots-label"></p>
            <div className="package-screenshots" id="package-screenshots">
                <img
                    id="screenshot_one"
                    src={pkg.screenshots[0]}
                    className="package-img"
                    alt="First screenshot" onMouseEnter={() => {
                    document.getElementById("full-screen-img").src = pkg.screenshots[0]
                }} onClick={() => {
                    if (!mobile) {
                        console.log('click')
                        document.getElementById("full-screen-img").src = pkg.screenshots[0]
                    }
                    document.getElementById("full-screen").style.zIndex = "15"
                    document.getElementById("full-screen").style.opacity = "1"
                    document.getElementById("full-screen-img").style.scale = "1"
                }}/>
                <img
                    id="screenshot_two"
                    src={pkg.screenshots[1]}
                    className="package-img"
                    style={{marginLeft: "5px"}}
                    alt="Second screenshot" onMouseEnter={() => {
                    document.getElementById("full-screen-img").src = pkg.screenshots[1]
                }} onClick={() => {
                    if (!mobile) {
                        document.getElementById("full-screen-img").src = pkg.screenshots[1]
                    }
                    document.getElementById("full-screen").style.zIndex = "15"
                    document.getElementById("full-screen").style.opacity = "1"
                    document.getElementById("full-screen-img").style.scale = "1"
                }}
                /><br id="screenshotbreak"/>
                <img
                    id="screenshot_three"
                    src={pkg.screenshots[2]}
                    className="package-img"
                    alt="Third screenshot" onMouseEnter={() => {
                    document.getElementById("full-screen-img").src = pkg.screenshots[2]
                }} onClick={() => {
                    if (!mobile) {
                        document.getElementById("full-screen-img").src = pkg.screenshots[2]
                    }
                    document.getElementById("full-screen").style.zIndex = "15"
                    document.getElementById("full-screen").style.opacity = "1"
                    document.getElementById("full-screen-img").style.scale = "1"
                }}
                />
                <img
                    id="screenshot_four"
                    src={pkg.screenshots[3]}
                    className="package-img"
                    style={{marginLeft: "5px"}}
                    alt="Fourth screenshot" onMouseEnter={() => {
                    document.getElementById("full-screen-img").src = pkg.screenshots[3]
                }} onClick={() => {
                    if (!mobile) {
                        document.getElementById("full-screen-img").src = pkg.screenshots[3]
                    }
                    document.getElementById("full-screen").style.zIndex = "15"
                    document.getElementById("full-screen").style.opacity = "1"
                    document.getElementById("full-screen-img").style.scale = "1"
                }}
                />
            </div>
            <p className="package-characteristics-label"></p>
            <div className="package-characteristics">
                <p>DOWNLOADS: {shortNumber(pkg.downloads.length)}<br/>AVERAGE HAPPINESS: <span
                    id="happiness_num">xx.x</span><br/>↳ <span id="review_num">5</span> <span
                    id="review_num_plural">ratings</span>

                    {/*<span id="rate_btn"><br/>↳*/}

                    {/*<Popup trigger={<span className="rate_btn">{">> RATE THIS <<"}</span>} modal id="rating-popup"*/}
                    {/*       ref={popupRef} onOpen={() => {*/}
                    {/*    if (!is_logged_in) {*/}
                    {/*        document.getElementById("popup-root").firstChild.firstChild.innerHTML = '<h4>⚠️</h4><p class="popup-signin-txt">You need to sign in to be able to rate packages.</p><button class="secondary popup-signin-btn" id="popup-sign-in">SIGN_IN</button>'*/}
                    {/*        document.getElementById("popup-sign-in").onclick = () => {*/}
                    {/*            navigate("/sign-in")*/}
                    {/*        }*/}
                    {/*        document.getElementById("popup-go-back").onclick = () => {*/}
                    {/*            popupRef.current.close()*/}
                    {/*        }*/}
                    {/*    }*/}
                    {/*}}>*/}
                    {/*    <h3 className="rating-popup-title">RATE THIS PACKAGE</h3>*/}
                    {/*    <span className="rating-popup-input"><input type='number' max='100' min='0'*/}
                    {/*                                                maxLength='3' className='rating_input'*/}
                    {/*                                                id='rating_input' onInput={() => {*/}
                    {/*        console.log(is_logged_in)*/}
                    {/*        if (document.getElementById("rating_input").value > 100) {*/}
                    {/*            document.getElementById("rating_input").value = 100*/}
                    {/*        } else if (document.getElementById("rating_input").value < 0) {*/}
                    {/*            document.getElementById("rating_input").value = 0*/}
                    {/*        }*/}
                    {/*    }}/>&nbsp;/100</span>*/}
                    {/*    <br/>*/}
                    {/*    <button className='secondary rating-popup-btn' id='rating_done_btn' onClick={async () => {*/}
                    {/*        // if no map exists on the package firebase doc, create one and add the rating, else add the rating to the map*/}
                    {/*        await updateDoc(doc(db, "packages", pkg.id), {*/}
                    {/*            // get all existing ratings of the package using the pkg object, and add the new rating to the map*/}
                    {/*            ratings: {*/}
                    {/*                ...pkg.ratings,*/}
                    {/*                [uid]: document.getElementById("rating_input").value*/}
                    {/*            }*/}
                    {/*        }).then(() => {*/}
                    {/*            // reload the page to update the rating*/}
                    {/*            window.location.reload();*/}
                    {/*        })*/}
                    {/*    }}>SUBMIT</button>*/}

                    {/*</Popup>*/}


                    {/*</span>*/}

                    <br/>
                    DISK SIZE: {Math.round(pkg.sizeMb * 10) / 10}MB<br/><span className="current-ver">
                        VERSION: {pkg.current_version}</span><br/>
                    <button className="package-download-side pkg-side-dwnl" id="package-download-side"
                            onClick={() => downloadPkg()}>DOWNLOAD
                    </button>
                    <Popup trigger={
                        <button className="secondary package-rate-btn"
                                onClick={() => {
                                }} style={{
                            width: "152px",
                            borderTopLeftRadius: "0px",
                            borderTopRightRadius: "0px",
                            display: "none"
                        }} id="package-rate-btn">RATE PACKAGE
                        </button>
                    } modal id="rating-popup"
                           ref={popupRef} onOpen={() => {
                        if (!is_logged_in) {
                            document.getElementById("popup-root").firstChild.firstChild.innerHTML = '<h4>⚠️</h4><p class="popup-signin-txt">You need to sign in to be able to rate packages.</p><button class="secondary popup-signin-btn" id="popup-sign-in">SIGN_IN</button>'
                            document.getElementById("popup-sign-in").onclick = () => {
                                navigate("/sign-in")
                            }
                            document.getElementById("popup-go-back").onclick = () => {
                                popupRef.current.close()
                            }
                        }
                    }} className="package-rate-popup">
                        <h3 className="rating-popup-title">&nbsp;&nbsp;RATE THIS PACKAGE&nbsp;&nbsp;</h3>
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
                        }}>SUBMIT
                        </button>
                        <br/>

                    </Popup>

                </p>
            </div>
            {/*<div className="bottom-block"></div>*/}
        </>
    )
}