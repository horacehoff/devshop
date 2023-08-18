import "./accountPage.css"
import {SiGithub} from "react-icons/si";
import fancy_name_to_id from "./utility.js";
import React, {useEffect, useState} from "react";
import PackageCard from "./packageCard.jsx";
import {Link, useNavigate, useParams} from "react-router-dom";
import {collection, doc, getDocs, query, updateDoc, where} from "firebase/firestore";
import {db, user_data} from "./firebase.js";
import SnippetCard from "./snippetCard.jsx";
import shortNumber from "short-number";
import {BiUserCheck, BiUserMinus, BiUserPlus} from "react-icons/bi";

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
                querysn.forEach((doc) => {
                    setUsr(doc.data())
                })
            })
        }
        if (usr !== null) {
            document.title = usr.username + " - DEVSHOP";
            if (usr.github === "" || usr.github === undefined) {
                document.getElementById("user_github").style.display = "none";
                document.getElementById("user_id_middle_dot").style.display = "none";
            }
            let card = document.querySelector('.user_pfp');
            let banner = document.querySelector('.user_banner');

            if (usr.followers.includes(user_data.uid) && user_data.following.includes(usr.uid)) {
                document.getElementById("follow_btn").style.display = "none"
                document.getElementById("user_following").style.display = "block"
                document.getElementById("follow_btn").onclick = () => {
                }
                document.getElementById("follow_num_2").innerText = shortNumber(usr.followers.length)
            } else {
                document.getElementById("follow_num_1").innerText = shortNumber(usr.followers.length)
            }

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
                    if (final_packages.length === 0) {
                        document.getElementById("user-pkgss").style.display = "none";
                        document.getElementById("user-snippets").style.marginTop = "400px"
                    }
                })
            }
            const getUsrCodeBlocks = () => {
                let final_packages = []
                const q = query(collection(db, "snippets"), where("owner_username", "==", usr.username));
                getDocs(q).then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        final_packages.push(new Object(doc.data()))
                    })
                    setUsrCodeBlocks(final_packages)
                    if (final_packages.length === 0) {
                        document.getElementById("user-snippets").style.display = "none";
                        // document.getElementById("user-pkgss").style.marginTop = "400px"
                    }
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
            <button className="user_follow_btn search-btn" id="follow_btn" onClick={async () => {
                let new_following = user_data.following;
                if (!new_following) {
                    new_following = []
                }
                new_following.push(usr.uid)
                await updateDoc(doc(db, "users", user_data.uid), {
                    following: new_following
                })
                let new_followers = usr.followers;
                if (!new_followers) {
                    new_followers = []
                }
                new_followers.push(user_data.uid)
                await updateDoc(doc(db, "users", usr.uid), {
                    followers: new_followers
                })
                window.location.reload()
                // document.getElementById("follow_btn").style.display = "none"
                // document.getElementById("user_following").style.display = "block"
            }}><BiUserPlus className="user_follow_btn_icon"/>FOLLOW <span className="user_follow_btn_num">· <span
                id="follow_num_1">...</span></span>
            </button>
            <div className="user_following" id="user_following">
                <button className="search-btn" id="following_btn" style={{cursor: "pointer"}}><BiUserCheck
                    className="user_follow_btn_icon"/>FOLLOWING <span className="user_follow_btn_num">· <span
                    id="follow_num_2">...</span></span>
                </button>
                <button className="user_unfollow_btn search-btn" style={{cursor: "pointer"}} onClick={async () => {
                    if (usr.followers.includes(user_data.uid) && user_data.following.includes(usr.uid) && user_data.following.length > 0 && usr.followers.length > 0) {
                        let new_following = user_data.following;
                        new_following.splice(new_following.indexOf(usr.uid), 1)
                        await updateDoc(doc(db, "users", user_data.uid), {
                            following: new_following
                        })
                        let new_followers = usr.followers;
                        new_followers.splice(new_followers.indexOf(user_data.uid), 1)
                        await updateDoc(doc(db, "users", usr.uid), {
                            followers: new_followers
                        })
                        window.location.reload()
                    }
                }}><BiUserMinus className="user_follow_btn_icon" style={{marginRight: "0"}}/> UNFOLLOW
                </button>
            </div>
            <div id="user-pkgss">
                <h2 className="user_packages_title" id="user-pkgs">PACKAGES</h2>
                <ul className="packages-card-list" id="packages-card-list" style={{marginTop: "460px"}}>
                    {usrPackages.map((pkg, index) => (
                        <li key={index} className="packages-card-list-child">
                            <Link to={"/packages/" + pkg.id} style={{textDecoration: "none", color: "white"}}>
                                <PackageCard dwnl={shortNumber(pkg.downloads)} author={pkg.owner_username}
                                             name={pkg.name}
                                             catchphrase={pkg.catchphrase} banner={pkg.banner}/>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
            <div id="user-snippets">
                <br/>
                <h2 style={{
                    marginLeft: "35px",
                    fontSize: "27px",
                    width: "calc(100% - 50px)",
                    marginBottom: "10px",
                    paddingRight: "15px"
                }} id="user-snippets-title">SNIPPETS</h2>
                <ul className="packages-card-list" id="packages-card-list">
                    {usrCodeBlocks.map((pkg, index) => (
                        <li key={index} className="packages-card-list-child">
                            <Link to={"/snippets/" + pkg.id} style={{textDecoration: "none", color: "white"}}>
                                <SnippetCard name={pkg.name} dwnl={pkg.downloads} author={pkg.owner_username}
                                             description={pkg.catchphrase}/>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

        </>
    )

}