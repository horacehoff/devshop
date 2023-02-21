import "./packagePage.css"
import Navbar from "./Navbar.jsx";

export default function PackagePage() {
    return (
        <>
            <Navbar/>
            <div className="banner"></div>
            <h2 className="package-title">Homebrew</h2>
            <h3 className="package-author">// BY <span style={{color: "#F0EBBA"}}>HomebrewTEAM</span></h3>
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
                <img src={"https://brew.sh/assets/img/homebrew-social-card.png"} className="package-img-one"/>
                <img src={"https://brew.sh/assets/img/homebrew-social-card.png"} className="package-img-two"/>
                <img src={"https://brew.sh/assets/img/homebrew-social-card.png"} className="package-img-three"/>
                <img src={"https://brew.sh/assets/img/homebrew-social-card.png"} className="package-img-four"/>
            </div>
            <p className="package-characteristics-label"></p>
            <div className="package-characteristics">
                <p>TOTAL DOWNLOADS: 1.45K<br/>AVERAGE HAPPINESS: 100%<br/>TOTAL SIZE: 5.8MB</p>
            </div>
        </>
    )
}