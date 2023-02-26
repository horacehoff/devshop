import "./packagePage.css"
import Navbar from "./Navbar.jsx";
import {useNavigate} from "react-router-dom";
import {onAuthStateChanged} from "firebase/auth";
import {auth} from "./firebase.js";

export default function PackagePage() {
    const navigate = useNavigate();
    let is_logged_in = false;
    onAuthStateChanged(auth, (user) => {
        if (user) {
            is_logged_in = true;

        } else {
            is_logged_in = false;
        }
    });
    return (
        <>
            <Navbar/>
            <div className="banner"></div>
            <h2 className="package-title">Homebrew</h2>
            <h3 className="package-author">// BY <span style={{color: "#F0EBBA"}}>HomebrewTEAM</span></h3>
            <button className="package-download-btn" id="package-download-btn">{"DOWNLOAD -> 0$"}</button>
            <p className="package-description-label">// 01 - DESCRIPTION</p>
            <p className="package-description">Homebrew offers a wide variety of packages to download. Its available
                platforms are macOS and Linux, and Windows support is coming soonHomebrew offers a wide variety of
                packages to download. Its available platforms are macOS and Linux, and Windows support is coming
                soonHomebrew offers a wide variety of packages to download. Its available platforms are macOS and Linux,
                and Windows support is coming soonHomebrew offers a wide variety of packages to download. Its available
                platforms are macOS and Linux, and Windows support is coming Homebrew offers a wide variety of packages
                to download. Its available platforms are macOS and Linux, and Windows support is coming soHomebrew
                offers a wide variety of packages to download. Its available platforms are macOS and Linux, and Windows
                support is coming sooHomebrew offers a wide variety of packages to download. Its available platforms are
                macOS and Linux, and Windows support is coming soonnonsoon</p>
            <p className="package-screenshots-label"></p>
            <div className="package-screenshots">
                <img src={"https://brew.sh/assets/img/homebrew-social-card.png"} className="package-img"/>
                <img src={"https://brew.sh/assets/img/homebrew-social-card.png"} className="package-img"
                     style={{marginLeft: "25px"}}/>
                <img src={"https://brew.sh/assets/img/homebrew-social-card.png"} className="package-img"
                     style={{marginLeft: "25px"}}/>
                <img src={"https://brew.sh/assets/img/homebrew-social-card.png"} className="package-img"
                     style={{marginLeft: "25px", marginRight: "15px"}}/>
            </div>
            <p className="package-characteristics-label"></p>
            <div className="package-characteristics">
                <p>TOTAL DOWNLOADS: 1.45K<br/>AVERAGE HAPPINESS: 100%<br/>TOTAL SIZE: 5.8MB<br/>CURRENT VERSION: 0.X.X
                </p>
            </div>
        </>
    )
}