import "./packagePage.css"
import Navbar from "./Navbar.jsx";
import {onAuthStateChanged} from "firebase/auth";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {auth, db, storage} from "./firebase.js";
import {useEffect, useState} from "react";
import {getDownloadURL, ref} from "firebase/storage";
import {useNavigate} from "react-router-dom";
import shortNumber from "short-number";

export default function PackagePage(props) {
    const pkg = props.pkg;
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
        } else {
            set_is_logged_in(false);
        }
    });


    useEffect(() => {
        let card = document.querySelector('.banner');
        card.style.setProperty("--banner_url", `url(${pkg.banner})`);
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

    }, []);
    return (
        <>
            <Navbar/>
            <div className="banner"></div>
            <h2 className="package-title">{pkg.name}</h2>
            <h3 className="package-author">// BY <span style={{color: "#F0EBBA"}}>{pkg.owner_username}</span></h3>
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
            <p className="package-description">{pkg.description}</p>
            <p className="package-screenshots-label"></p>
            <div className="package-screenshots" id="package-screenshots">
                <img
                    id="screenshot_one"
                    src={pkg.screenshots[0]}
                    className="package-img"
                    alt="First screenshot"/>
                <img
                    id="screenshot_two"
                    src={pkg.screenshots[1]}
                    className="package-img"
                    style={{marginLeft: "5px"}}
                    alt="Second screenshot"
                /><br id="screenshotbreak"/>
                <img
                    id="screenshot_three"
                    src={pkg.screenshots[2]}
                    className="package-img"
                    alt="Third screenshot"
                />
                <img
                    id="screenshot_four"
                    src={pkg.screenshots[3]}
                    className="package-img"
                    style={{marginLeft: "5px"}}
                    alt="Fourth screenshot"
                />
            </div>
            <p className="package-characteristics-label"></p>
            <div className="package-characteristics">
                <p>TOTAL DOWNLOADS: {shortNumber(pkg.downloads)}<br/>AVERAGE HAPPINESS: 100%<br/>TOTAL
                    SIZE: {Math.round(pkg.sizeMb * 10) / 10}MB<br/>CURRENT VERSION: {pkg.current_version}
                </p>
            </div>
            <div className="bottom-block"></div>
        </>
    )
}