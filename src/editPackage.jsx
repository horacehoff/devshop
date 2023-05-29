import './packagePage.css'
import "./editPackage.css"
import {onAuthStateChanged} from "firebase/auth";
import {auth} from "./firebase.js";
import fancy_name_to_id from "./utility.js";
import {useNavigate} from "react-router-dom";
import Navbar from "./Navbar.jsx";
import MDEditor from "@uiw/react-md-editor";
import shortNumber from "short-number";
import React, {useEffect, useState} from "react";

export default function EditPackage(props) {
    const pkg = props.pkg
    const navigate = useNavigate()
    let uid = "";
    let baseStyle = {}
    const [is_logged_in, set_is_logged_in] = useState(false);
    const [new_downloads, set_new_downloads] = useState(0);


    window.mobileCheck = function () {
        let check = false;
        (function (a) {
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
        })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    };


    onAuthStateChanged(auth, (user) => {
        if (user) {
            // check if user id is the package owner_id
            if (user.uid === pkg.owner_id) {
                console.log("user is owner")
                uid = user.uid;
            } else {
                console.log("user is not owner")
                navigate("/packages/" + fancy_name_to_id(pkg.id))
            }
        } else {
            console.log("user is not logged in")
            navigate("/packages/" + fancy_name_to_id(pkg.id))
        }
    })

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
    }, []);

    return (
        <>
            <>
                <Navbar/>
                <div className="banner banner-edit"></div>
                <h2 className="package-title">{pkg.name}</h2>
                <h3 className="package-author">// BY <span
                    style={{color: "#F0EBBA", cursor: "pointer"}}>{pkg.owner_username}</span>
                </h3>
                <button className="package-download-btn" id="package-download-btn" onClick={() => {
                    // download pkg
                    if (!is_logged_in) {
                        navigate("/packages/" + fancy_name_to_id(pkg.id))
                    }

                }}>{"SAVE"}</button>
                <p className="package-description-label">// 01 - DESCRIPTION</p>
                <p className="package-description package-description-edit">{
                    <MDEditor
                        className="package-desc-editor-edit"
                        height="100%"
                        id="package-desc-editor"
                        value={pkg.description}
                        onChange={e => {
                            document.getElementById("package-desc-editor").value = e;
                        }}
                    />
                }</p>
                <p className="package-screenshots-label"></p>
                <div className="package-screenshots" id="package-screenshots">
                    <img
                        id="screenshot_one"
                        src={pkg.screenshots[0]}
                        className="package-img package-img-edit"
                        alt="First screenshot"/>
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
                    <p>TOTAL DOWNLOADS: {shortNumber(pkg.downloads)}<br/>AVERAGE HAPPINESS: <span
                        id="happiness_num">xx.x</span><br/>↳ <span id="review_num">5</span> <span
                        id="review_num_plural">ratings</span>
                        <br/>TOTAL SIZE: {Math.round(pkg.sizeMb * 10) / 10}MB<br/>CURRENT VERSION: {pkg.current_version}
                    </p>
                </div>
                <div className="bottom-block"></div>
            </>

        </>
    )

}