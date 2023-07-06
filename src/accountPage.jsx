import "./accountPage.css"
import {SiGithub} from "react-icons/si";
import fancy_name_to_id from "./utility.js";
import React, {useEffect, useState} from "react";
import PackageCard from "./packageCard.jsx";
import {Link, useNavigate, useParams} from "react-router-dom";
import {collection, getDocs, query, where} from "firebase/firestore";
import {db} from "./firebase.js";
import CodeCard from "./codeCard.jsx";
import shortNumber from "short-number";

export default function AccountPage(props) {
    const [usr, setUsr] = useState(null)
    const [usrPackages, setUsrPackages] = useState([])
    const [usrCodeBlocks, setUsrCodeBlocks] = useState([])
    const navigate = useNavigate();


    const params_id = useParams().id;
    useEffect(() => {
        if (usr === null) {
            const q = query(collection(db, "users"), where("username", "==", params_id))
            getDocs(q).then((querysn) => {
                console.log("heyyy")
                querysn.forEach((doc) => {
                    console.log("HEYYYYA")
                    setUsr(doc.data())
                    console.log("usr: ", usr)
                })
            })
            // getDoc(doc(db, "users", params_id)).then((doc) => {
            //     if (doc.exists()) {
            //         setUsr(doc.data());
            //         console.log("usr: ", usr)
            //     } else {
            //         navigate("/packages")
            //     }
            // })
        }
        if (usr !== null) {
            document.title = usr.username + " - DEVSHOP";
            if (usr.github === "" || usr.github === undefined) {
                document.getElementById("user_github").style.display = "none";
                document.getElementById("user_id_middle_dot").style.display = "none";
            }
            let card = document.querySelector('.user_pfp');
            let banner = document.querySelector('.user_banner');


            let pfp_url = "https://source.boringavatars.com/pixel/120/" + usr.username + "?colors=6E00FF,0300FF,000000,FC7600,FFFFFF";
            let banner_url = "https://source.boringavatars.com/marble/850/" + usr.username + "?square"
            if (usr.pfp_path !== "" && usr.pfp_path !== undefined) {
                pfp_url = usr.pfp_path;
            }
            if (usr.banner_path !== "" && usr.banner_path !== undefined) {
                banner_url = usr.banner_path;
            }

            card.style.setProperty("--pfp_url", `url(${pfp_url})`);
            banner.style.setProperty("--banner_url", `url(${banner_url})`);

            const getUsrPackages = () => {
                let final_packages = []
                const q = query(collection(db, "packages"), where("owner_username", "==", usr.username));
                getDocs(q).then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        final_packages.push(new Object(doc.data()))
                    })
                    setUsrPackages(final_packages)
                })
            }
            const getUsrCodeBlocks = () => {
                let final_packages = []
                const q = query(collection(db, "code-blocks"), where("owner_username", "==", usr.username));
                getDocs(q).then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        final_packages.push(new Object(doc.data()))
                    })
                    setUsrCodeBlocks(final_packages)
                })
            }
            getUsrPackages();
            getUsrCodeBlocks();
        }

    }, [usr]);

    if (usr === null) {
        return <>
        </>
    }

    return (
        <>
            <div className="user_banner"></div>
            <div className="user_pfp"></div>
            <h1 className="user_name">{usr.username}</h1>
            <p className="user_id">{"@" + fancy_name_to_id(usr.username)} <span id="user_id_middle_dot">·</span><span
                className="user_github" id="user_github"><SiGithub className="user_github_icon"/><span
                className="user_github_id" onClick={() => {
                window.open("https://github.com/" + usr.github, '_blank').focus();
            }}>{usr.github}</span></span></p>
            <p className="user_bio">{usr.bio}</p>
            <h2 className="user_packages_title">PACKAGES</h2>
            <ul className="packages-card-list" id="packages-card-list" style={{marginTop: "450px"}}>
                {usrPackages.map((pkg, index) => (
                    <li key={index} className="packages-card-list-child">
                        <Link to={"/packages/" + pkg.id} style={{textDecoration: "none", color: "white"}}>
                            <PackageCard dwnl={shortNumber(pkg.downloads)} author={pkg.owner_username} name={pkg.name}
                                         catchphrase={pkg.catchphrase} banner={pkg.banner}/>
                        </Link>
                    </li>
                ))}
            </ul>
            <h2 className="user_packages_title">CODE BLOCKS</h2>
            <ul className="packages-card-list" id="packages-card-list" style={{marginTop: "450px"}}>
                {usrCodeBlocks.map((pkg, index) => (
                    <li key={index} className="packages-card-list-child">
                        <Link to={"/codeblocks/" + pkg.id} style={{textDecoration: "none", color: "white"}}>
                            <CodeCard name={pkg.name} dwnl={pkg.downloads} author={pkg.owner_username}
                                      description={pkg.catchphrase}/>
                        </Link>
                    </li>
                ))}
            </ul>
        </>
    )

}