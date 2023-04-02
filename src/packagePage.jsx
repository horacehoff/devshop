import "./packagePage.css"
import Navbar from "./Navbar.jsx";
import {onAuthStateChanged} from "firebase/auth";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {auth, db, storage} from "./firebase.js";
import {useEffect, useState} from "react";
import {getDownloadURL, ref} from "firebase/storage";

export default function PackagePage(props) {
    const pkg = props.pkg;

    const [is_logged_in, set_is_logged_in] = useState(false);
    const [new_downloads, set_new_downloads] = useState(0);
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
    }, []);
    return (
        <>
            <Navbar/>
            <div className="banner"></div>
            <h2 className="package-title">{pkg.name}</h2>
            <h3 className="package-author">// BY <span style={{color: "#F0EBBA"}}>{pkg.owner_username}</span></h3>
            <button className="package-download-btn" id="package-download-btn" onClick={() => {
                // download pkg
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
                    id="screenshot_zero"
                    src={pkg.screenshots[0]}
                    className="package-img"
                    onClick={() => {
                        document.getElementById("screenshot_zero").scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                        });
                    }}
                />
                <img
                    src={pkg.screenshots[1]}
                    className="package-img"
                    style={{marginLeft: "25px"}}
                    onClick={() => {
                        document.getElementById("screenshot_one").scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                        });
                    }}
                    id="screenshot_one"
                />
                <img
                    src={pkg.screenshots[2]}
                    className="package-img"
                    style={{marginLeft: "25px"}}
                    onClick={() => {
                        document.getElementById("screenshot_two").scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                        });
                    }}
                    id="screenshot_two"
                />
                <img
                    src={pkg.screenshots[3]}
                    className="package-img"
                    style={{marginLeft: "25px", marginRight: "15px"}}
                    onClick={() => {
                        document.getElementById("screenshot_three").scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                        });
                    }}
                    id="screenshot_three"
                />
            </div>
            <p className="package-characteristics-label"></p>
            <div className="package-characteristics">
                <p>TOTAL DOWNLOADS: {pkg.downloads}<br/>AVERAGE HAPPINESS: 100%<br/>TOTAL
                    SIZE: {Math.round(pkg.sizeMb * 10) / 10}MB<br/>CURRENT VERSION: {pkg.current_version}
                </p>
            </div>
            <div className="bottom-block"></div>
        </>
    )
}