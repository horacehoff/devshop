import "./packages.css"
import Navbar from "./Navbar.jsx";
import {lazy} from "react";
const PackageCard = lazy(() => import('./packageCard.jsx'))

export default function Packages() {
    function handler(e) {
        const isTouchPad = e.wheelDeltaY ? e.wheelDeltaY === -3 * e.deltaY : e.deltaMode === 0;
        if (!isTouchPad) {
            const packagesCardListChild = document.getElementsByClassName("packages-card-list-child");
            for (let i = 0; i < packagesCardListChild.length; i++) {
                packagesCardListChild[i].style.marginRight = "15px";
                packagesCardListChild[i].style.marginTop = "10px";
                document.getElementsByClassName("card")[i].style.width = "calc(100vw / 3 - 50px)";
            }
            const packagesCardList = document.getElementsByClassName("packages-card-list");
            for (let i = 0; i < packagesCardList.length; i++) {
                packagesCardList[i].style.transform = "translateY(-20px)";
                packagesCardList[i].style.whiteSpace = "normal";
            }
        }
        document.removeEventListener("wheel", handler, false);
    }

    document.addEventListener("wheel", handler, {passive: false});

    return (
        <>
            <Navbar/>
            <h1 className="packages-title">PACKAGES</h1>
            <h2 className="category-title">// CURRENTLY TRENDING</h2>
            <ul className="packages-card-list" id="packages-card-list">
                <li className="packages-card-list-child"><PackageCard dwnl="55566564" author="hombrewTeam"
                                 desc="Homebrew offers a wide variety of packages to download. Its available platforms are macOS and Linux, and Windows support is coming soon"/>
                </li>
                <li className="packages-card-list-child"><PackageCard dwnl="55566564" author="hombrewTeam"
                                                          desc="Homebrew offers a wide variety of packages to download. Its available platforms are macOS and Linux, and Windows support is coming soon"/>
                </li>
                <li className="packages-card-list-child"><PackageCard dwnl="55566564" author="hombrewTeam"
                                                          desc="Homebrew offers a wide variety of packages to download. Its available platforms are macOS and Linux, and Windows support is coming soon"/>
                </li>
                <li className="packages-card-list-child"><PackageCard dwnl="55566564" author="hombrewTeam"
                                                          desc="Homebrew offers a wide variety of packages to download. Its available platforms are macOS and Linux, and Windows support is coming soon"/>
                </li>
                <li className="packages-card-list-child"><PackageCard dwnl="55566564" author="hombrewTeam"
                                                          desc="Homebrew offers a wide variety of packages to download. Its available platforms are macOS and Linux, and Windows support is coming soon"/>
                </li>
                <li className="packages-card-list-child"><PackageCard dwnl="55566564" author="hombrewTeam"
                                                          desc="Homebrew offers a wide variety of packages to download. Its available platforms are macOS and Linux, and Windows support is coming soon"/>
                </li>
                <li className="packages-card-list-child"><PackageCard dwnl="55566564" author="hombrewTeam"
                                                                      desc="Homebrew offers a wide variety of packages to download. Its available platforms are macOS and Linux, and Windows support is coming soon"/>
                </li>
                <li className="packages-card-list-child"><PackageCard dwnl="55566564" author="hombrewTeam"
                                                                      desc="Homebrew offers a wide variety of packages to download. Its available platforms are macOS and Linux, and Windows support is coming soon"/>
                </li>
                <li className="packages-card-list-child"><PackageCard dwnl="55566564" author="hombrewTeam"
                                                                      desc="Homebrew offers a wide variety of packages to download. Its available platforms are macOS and Linux, and Windows support is coming soon"/>
                </li>
            </ul>
            <h2 className="category-title">// RECENTLY CREATED</h2>
            <ul className="packages-card-list" id="packages-card-list">
                <li className="packages-card-list-child"><PackageCard dwnl="55566564" author="hombrewTeam"
                                                                      desc="Homebrew offers a wide variety of packages to download. Its available platforms are macOS and Linux, and Windows support is coming soon"/>
                </li>
                <li className="packages-card-list-child"><PackageCard dwnl="55566564" author="hombrewTeam"
                                                                      desc="Homebrew offers a wide variety of packages to download. Its available platforms are macOS and Linux, and Windows support is coming soon"/>
                </li>
                <li className="packages-card-list-child"><PackageCard dwnl="55566564" author="hombrewTeam"
                                                                      desc="Homebrew offers a wide variety of packages to download. Its available platforms are macOS and Linux, and Windows support is coming soon"/>
                </li>
                <li className="packages-card-list-child"><PackageCard dwnl="55566564" author="hombrewTeam"
                                                                      desc="Homebrew offers a wide variety of packages to download. Its available platforms are macOS and Linux, and Windows support is coming soon"/>
                </li>
                <li className="packages-card-list-child"><PackageCard dwnl="55566564" author="hombrewTeam"
                                                                      desc="Homebrew offers a wide variety of packages to download. Its available platforms are macOS and Linux, and Windows support is coming soon"/>
                </li>
                <li className="packages-card-list-child"><PackageCard dwnl="55566564" author="hombrewTeam"
                                                                      desc="Homebrew offers a wide variety of packages to download. Its available platforms are macOS and Linux, and Windows support is coming soon"/>
                </li>
                <li className="packages-card-list-child"><PackageCard dwnl="55566564" author="hombrewTeam"
                                                                      desc="Homebrew offers a wide variety of packages to download. Its available platforms are macOS and Linux, and Windows support is coming soon"/>
                </li>
                <li className="packages-card-list-child"><PackageCard dwnl="55566564" author="hombrewTeam"
                                                                      desc="Homebrew offers a wide variety of packages to download. Its available platforms are macOS and Linux, and Windows support is coming soon"/>
                </li>
                <li className="packages-card-list-child"><PackageCard dwnl="55566564" author="hombrewTeam"
                                                                      desc="Homebrew offers a wide variety of packages to download. Its available platforms are macOS and Linux, and Windows support is coming soon"/>
                </li>
            </ul>
        </>
    )
}