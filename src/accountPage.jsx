import "./accountPage.css"
import Navbar from "./Navbar.jsx";
import {SiGithub} from "react-icons/si";
import fancy_name_to_id from "./utility.js";
import {useEffect, useState} from "react";
import PackageCard from "./packageCard.jsx";
import {useNavigate} from "react-router-dom";

export default function AccountPage(props) {
    const usr = props.user;
    const pkgs = props.packagesData
    const [usrPackages, setUsrPackages] = useState([])
    const navigate = useNavigate();


    useEffect(() => {
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
            pkgs.forEach((pkg) => {
                if (pkg.owner_id === usr.uid) {
                    final_packages.push(pkg)
                }
            })
            setUsrPackages(final_packages)
        }
        getUsrPackages();
    }, []);
    return (
        <>
            <Navbar/>
            <div className="user_banner"></div>
            <div className="user_pfp"></div>
            <h1 className="user_name">{usr.username}</h1>
            <p className="user_id">{"@" + fancy_name_to_id(usr.username)} <span id="user_id_middle_dot">·</span><span
                className="user_github" id="user_github" onClick={() => {
                window.open("https://github.com/" + usr.github, '_blank').focus();
            }}><SiGithub className="user_github_icon"/><span
                className="user_github_id">{usr.github}</span></span></p>
            <p className="user_bio">{usr.bio}</p>
            <h2 className="user_packages_title">PACKAGES</h2>
            <ul className="packages-card-list" id="packages-card-list" style={{marginTop: "450px"}}>
                {usrPackages.map((pkg, index) => (
                    <li key={index} className="packages-card-list-child" onClick={() => {
                        navigate("/packages/" + pkg.id)
                    }}>
                        <PackageCard dwnl={pkg.downloads} author={pkg.owner_username} name={pkg.name}
                                     desc={pkg.description} banner={pkg.banner} catchphrase={pkg.catchphrase}/>
                    </li>
                ))}
            </ul>
        </>
    )

}