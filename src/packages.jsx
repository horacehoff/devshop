import "./packages.css"
import Navbar from "./Navbar.jsx";
import PackageCard from "./packageCard.jsx";
import {db} from "./firebase.js";
import {useEffect} from "react";
import {doc, getDocs, collection} from "firebase/firestore";
import {query, orderBy, limit} from "firebase/firestore";


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

    let packages = [];
    const collectionRef = collection(db, 'packages')
    const q = query(collectionRef, orderBy("downloads", "desc"), limit(9))
    getDocs(q)
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                packages.push(doc.data())
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    console.log(packages)

    return (
        <>
            <Navbar/>
            <h1 className="packages-title">PACKAGES</h1>
            <h2 className="category-title">// CURRENTLY TRENDING</h2>
            <ul className="packages-card-list" id="packages-card-list">
                {
                    Object.entries(packages)
                        .map(([key, value]) => <>
                            <li className="packages-card-list-child">
                                <PackageCard dwnl="55" author="hombrewTeam" name="Homebrew"
                                             desc="Homebrew offers a wide variety of packages to download. Its available platforms are macOS and Linux, and Windows support is coming soon"/>
                            </li>
                        </>)
                }
                {/*<li className="packages-card-list-child"><PackageCard dwnl="55" author="hombrewTeam"*/}
                {/*                 desc="Homebrew offers a wide variety of packages to download. Its available platforms are macOS and Linux, and Windows support is coming soon"/>*/}
                {/*</li>*/}
                {/*<li className="packages-card-list-child"><PackageCard dwnl="55566564" author="hombrewTeam"*/}
                {/*                                          desc="Homebrew offers a wide variety of packages to download. Its available platforms are macOS and Linux, and Windows support is coming soon"/>*/}
                {/*</li>*/}
                {/*<li className="packages-card-list-child"><PackageCard dwnl="55566564" author="hombrewTeam"*/}
                {/*                                          desc="Homebrew offers a wide variety of packages to download. Its available platforms are macOS and Linux, and Windows support is coming soon"/>*/}
                {/*</li>*/}
                {/*<li className="packages-card-list-child"><PackageCard dwnl="55566564" author="hombrewTeam"*/}
                {/*                                          desc="Homebrew offers a wide variety of packages to download. Its available platforms are macOS and Linux, and Windows support is coming soon"/>*/}
                {/*</li>*/}
                {/*<li className="packages-card-list-child"><PackageCard dwnl="55566564" author="hombrewTeam"*/}
                {/*                                          desc="Homebrew offers a wide variety of packages to download. Its available platforms are macOS and Linux, and Windows support is coming soon"/>*/}
                {/*</li>*/}
                {/*<li className="packages-card-list-child"><PackageCard dwnl="55566564" author="hombrewTeam"*/}
                {/*                                          desc="Homebrew offers a wide variety of packages to download. Its available platforms are macOS and Linux, and Windows support is coming soon"/>*/}
                {/*</li>*/}
                {/*<li className="packages-card-list-child"><PackageCard dwnl="55566564" author="hombrewTeam"*/}
                {/*                                                      desc="Homebrew offers a wide variety of packages to download. Its available platforms are macOS and Linux, and Windows support is coming soon"/>*/}
                {/*</li>*/}
                {/*<li className="packages-card-list-child"><PackageCard dwnl="55566564" author="hombrewTeam"*/}
                {/*                                                      desc="Homebrew offers a wide variety of packages to download. Its available platforms are macOS and Linux, and Windows support is coming soon"/>*/}
                {/*</li>*/}
                {/*<li className="packages-card-list-child"><PackageCard dwnl="55566564" author="hombrewTeam"*/}
                {/*                                                      desc="Homebrew offers a wide variety of packages to download. Its available platforms are macOS and Linux, and Windows support is coming soon"/>*/}
                {/*</li>*/}
            </ul>
            <h2 className="category-title">// RECENTLY CREATED</h2>
            <ul className="packages-card-list" id="packages-card-list">
                {/*<li className="packages-card-list-child"><PackageCard dwnl="55566564" author="hombrewTeam"*/}
                {/*                                                      desc="Homebrew offers a wide variety of packages to download. Its available platforms are macOS and Linux, and Windows support is coming soon"/>*/}
                {/*</li>*/}
                {/*<li className="packages-card-list-child"><PackageCard dwnl="55566564" author="hombrewTeam"*/}
                {/*                                                      desc="Homebrew offers a wide variety of packages to download. Its available platforms are macOS and Linux, and Windows support is coming soon"/>*/}
                {/*</li>*/}
                {/*<li className="packages-card-list-child"><PackageCard dwnl="55566564" author="hombrewTeam"*/}
                {/*                                                      desc="Homebrew offers a wide variety of packages to download. Its available platforms are macOS and Linux, and Windows support is coming soon"/>*/}
                {/*</li>*/}
                {/*<li className="packages-card-list-child"><PackageCard dwnl="55566564" author="hombrewTeam"*/}
                {/*                                                      desc="Homebrew offers a wide variety of packages to download. Its available platforms are macOS and Linux, and Windows support is coming soon"/>*/}
                {/*</li>*/}
                {/*<li className="packages-card-list-child"><PackageCard dwnl="55566564" author="hombrewTeam"*/}
                {/*                                                      desc="Homebrew offers a wide variety of packages to download. Its available platforms are macOS and Linux, and Windows support is coming soon"/>*/}
                {/*</li>*/}
                {/*<li className="packages-card-list-child"><PackageCard dwnl="55566564" author="hombrewTeam"*/}
                {/*                                                      desc="Homebrew offers a wide variety of packages to download. Its available platforms are macOS and Linux, and Windows support is coming soon"/>*/}
                {/*</li>*/}
                {/*<li className="packages-card-list-child"><PackageCard dwnl="55566564" author="hombrewTeam"*/}
                {/*                                                      desc="Homebrew offers a wide variety of packages to download. Its available platforms are macOS and Linux, and Windows support is coming soon"/>*/}
                {/*</li>*/}
                {/*<li className="packages-card-list-child"><PackageCard dwnl="55566564" author="hombrewTeam"*/}
                {/*                                                      desc="Homebrew offers a wide variety of packages to download. Its available platforms are macOS and Linux, and Windows support is coming soon"/>*/}
                {/*</li>*/}
                {/*<li className="packages-card-list-child"><PackageCard dwnl="55566564" author="hombrewTeam"*/}
                {/*                                                      desc="Homebrew offers a wide variety of packages to download. Its available platforms are macOS and Linux, and Windows support is coming soon"/>*/}
                {/*</li>*/}
            </ul>
        </>
    )
}