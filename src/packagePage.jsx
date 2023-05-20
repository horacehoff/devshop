import "./packagePage.css"
import Navbar from "./Navbar.jsx";
import {onAuthStateChanged} from "firebase/auth";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {auth, db, storage} from "./firebase.js";
import {useEffect, useState} from "react";
import {getDownloadURL, ref} from "firebase/storage";
import {useNavigate} from "react-router-dom";
import shortNumber from "short-number";
import fancy_name_to_id from "./utility.js";
import ReactMarkdown from "react-markdown";

export default function PackagePage(props) {
    const pkg = props.pkg;
    const [uid, set_uid] = useState("");
    const [baseStyle, set_baseStyle] = useState({});
    const navigate = useNavigate();

    window.mobileCheck = function () {
        let check = false;
        (function (a) {
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
        })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    };

    const [is_logged_in, set_is_logged_in] = useState(false);
    const [new_downloads, set_new_downloads] = useState(0);
    const [touchpad, set_touchpad] = useState(false);
    onAuthStateChanged(auth, (user) => {
        if (user) {
            set_is_logged_in(true);
            set_uid(user.uid)
        } else {
            set_is_logged_in(false);
        }
    });

    useEffect(() => {
        let card = document.querySelector('.banner');
        card.style.setProperty("--banner_url", `url(${pkg.banner})`);
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


        // const scrollContainer = document.getElementById("package-screenshots")
        //
        // function handler(e) {
        //     const isTouchPad = e.wheelDeltaY ? e.wheelDeltaY === -3 * e.deltaY : e.deltaMode === 0;
        //     if (isTouchPad || window.mobileCheck()) {
        //         console.log("touchpad");
        //         set_touchpad(true);
        //         document.getElementById("package-screenshots").style.scrollSnapType = "x mandatory"
        //         document.getElementById("screenshot_one").style.scrollSnapAlign = "start"
        //         document.getElementById("screenshot_two").style.scrollSnapAlign = "start"
        //         document.getElementById("screenshot_three").style.scrollSnapAlign = "start"
        //         document.getElementById("screenshot_four").style.scrollSnapAlign = "start"
        //     }
        //     document.removeEventListener("wheel", handler, false);
        // }
        //
        // document.addEventListener("wheel", handler, {passive: false});
        //
        // function scroll_handle(evt) {
        //     if (!touchpad && !window.mobileCheck()) {
        //         console.log("function")
        //         evt.preventDefault();
        //         let newScrollLeft = scrollContainer.scrollLeft + (evt.deltaY * 10);
        //         let duration = 2000;
        //
        //         scrollContainer.scrollTo({
        //             left: newScrollLeft,
        //             behavior: 'smooth',
        //             duration: duration
        //         });
        //     } else {
        //         console.log("REMOVED")
        //         scrollContainer.removeEventListener("wheel", scroll_handle, {passive: false})
        //     }
        // }
        //
        // scrollContainer.addEventListener('wheel', scroll_handle, {passive: false});

        set_baseStyle(document.getElementById("screenshot_one").style)
    }, []);

    function fullScreen(img) {
        img.style.position = "fixed";
        img.style.top = "calc(50% - 42.5%)";
        img.style.left = "calc(50% - 42.5%)";
        img.style.width = "85%";
        img.style.height = "85%";
        img.style.zIndex = "9999";
        document.getElementById("screenshot_bg_div").style.display = "block";
        document.getElementById("screenshot_bg_div").style.backdropFilter = "blur(10px)";
        document.getElementById("screenshot_full_close").style.display = "block";
    }

    return (
        <>
            <Navbar/>
            <div style={{
                position: "fixed",
                display: "none",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                zIndex: "9998",
                backgroundColor: "rgba(0,0,0,0.25)"
            }} id="screenshot_bg_div"></div>
            <p className="screenshot_full_close" id="screenshot_full_close" onClick={() => {
                const revertChanges = img => {
                    img.style = baseStyle;
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
                document.getElementById("screenshot_full_close").style.display = "none";
            }}>CLOSE</p>
            <div className="banner"></div>
            <h2 className="package-title">{pkg.name}</h2>
            <h3 className="package-author">// BY <span style={{color: "#F0EBBA", cursor: "pointer"}}
                                                       onClick={() => navigate("/users/" + fancy_name_to_id(pkg.owner_username))}>{pkg.owner_username}</span>
            </h3>
            <button className="package-download-btn" id="package-download-btn" onClick={() => {
                // download pkg
                if (!is_logged_in) {
                    navigate("/sign-in")
                }
                let pkgRef = ref(storage, pkg.package);
                getDownloadURL(pkgRef).then((url) => {
                    window.location.assign(url);
                    if (is_logged_in) {
                        getDoc(doc(db, "packages", pkg.name)).then((doc) => {
                            if (doc.exists()) {
                                set_new_downloads(doc.data().downloads);
                            } else {
                                set_new_downloads(-1);
                            }
                        })
                        if (new_downloads !== -1) {
                            updateDoc(doc(db, "packages", pkg.name), {
                                downloads: new_downloads + 1
                            }).then(r => {
                                console.log("updated");
                            });
                        }

                    }
                })

            }}>{"DOWNLOAD -> 0$"}</button>
            <p className="package-description-label">// 01 - DESCRIPTION</p>
            <p className="package-description"><ReactMarkdown>{pkg.description}</ReactMarkdown></p>
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
                <p>TOTAL DOWNLOADS: {shortNumber(pkg.downloads)}<br/>AVERAGE HAPPINESS: <span
                    id="happiness_num">xx.x</span><br/>↳ <span id="review_num">5</span> <span
                    id="review_num_plural">ratings</span>

                    <span id="rate_btn"><br/>↳ <span className="rate_btn" onClick={() => {
                        document.getElementById("rate_btn").innerHTML = "<br/>RATING: <input type='number' max='100' min='0' maxlength='3' class='rating_input' id='rating_input'/><br/><button class='rating_done_btn' id='rating_done_btn'>SUBMIT</button>"
                        document.getElementById("rating_input").oninput = () => {
                            if (document.getElementById("rating_input").value > 100) {
                                document.getElementById("rating_input").value = 100
                            } else if (document.getElementById("rating_input").value < 0) {
                                document.getElementById("rating_input").value = 0
                            }
                        }

                        document.getElementById("rating_done_btn").onclick = async () => {
                            // if no map exists on the package firebase doc, create one and add the rating, else add the rating to the map
                            await updateDoc(doc(db, "packages", fancy_name_to_id(pkg.name)), {
                                // get all existing ratings of the package using the pkg object, and add the new rating to the map
                                ratings: {
                                    ...pkg.ratings,
                                    [uid]: document.getElementById("rating_input").value
                                }
                            }).then(() => {
                                // reload the page to update the rating
                                window.location.reload();
                            })

                        }
                    }}>{">> RATE THIS <<"}</span></span>

                    <br/>TOTAL SIZE: {Math.round(pkg.sizeMb * 10) / 10}MB<br/>CURRENT VERSION: {pkg.current_version}
                </p>
            </div>
            <div className="bottom-block"></div>
        </>
    )
}