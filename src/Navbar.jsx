import "./Navbar.css"
import {onAuthStateChanged} from "firebase/auth"
import {Link, useLocation, useNavigate} from "react-router-dom";
import {useEffect} from "react";
import fancy_name_to_id from "./utility.js";
import {user_data} from "./firebase.js";
import navicon from "/naviconwhite.png"
import data from "./Navbar.json"
import i18n from "i18next";
import {useTranslation} from "react-i18next";


export default function Navbar() {
    i18n.addResourceBundle("en", "nav", data.en)
    i18n.addResourceBundle("fr", "nav", data.fr)
    const {t} = useTranslation("nav");


    const navigate = useNavigate();
    const location = useLocation().pathname;
    const effectlocation = useLocation();

    const resetStyles = () => {
        document.getElementById("packages-nav").style.textDecoration = "none"
        document.getElementById("nav-packages").style.textDecoration = "none"
        document.getElementById("packages-nav").style.color = null
        document.getElementById("nav-packages").style.color = null
        document.getElementById("account-nav").style.textDecoration = "none"
        document.getElementById("nav-account").style.textDecoration = "none"
        document.getElementById("account-nav").style.color = null
        document.getElementById("nav-account").style.color = null
        document.getElementById("snippets-nav").style.textDecoration = "none"
        document.getElementById("nav-snippets").style.textDecoration = "none"
        document.getElementById("snippets-nav").style.color = null
        document.getElementById("nav-snippets").style.color = null
        document.getElementById("feedback-nav").style.textDecoration = "none"
        document.getElementById("nav-feedback").style.textDecoration = "none"
        document.getElementById("nav-about").style.textDecoration = "none"
        document.getElementById("feedback-nav").style.color = null
        document.getElementById("nav-feedback").style.color = null
        document.getElementById("nav-about").style.color = null
        document.getElementById("pricing-nav").style.textDecoration = "none"
        document.getElementById("nav-pricing").style.textDecoration = "none"
        document.getElementById("pricing-nav").style.color = null
        document.getElementById("nav-pricing").style.color = null

        document.getElementById("hamburger").innerHTML = "||"
        document.getElementById("full-nav").style.left = "-100%"
        document.getElementById("full-nav-account").style.left = "-100%"
    }


    useEffect(() => {
        resetStyles()
        if (location.slice(0, 9) === "/packages") {
            document.getElementById("packages-nav").style.textDecoration = "underline"
            document.getElementById("nav-packages").style.textDecoration = "underline"
            document.getElementById("packages-nav").style.color = "white"
            document.getElementById("nav-packages").style.color = "white"
        } else if (location.slice(0, 8) === "/sign-up" || location.slice(0, 8) === "/sign-in" || location.slice(0, 8) === "/account") {
            document.getElementById("account-nav").style.textDecoration = "underline"
            document.getElementById("nav-account").style.textDecoration = "underline"
            document.getElementById("account-nav").style.color = "white"
            document.getElementById("nav-account").style.color = "white"
            document.title = "SIGN UP/IN - DEVSHOP"
        } else if (location.slice(0, 9) === "/snippets") {
            document.getElementById("snippets-nav").style.textDecoration = "underline"
            document.getElementById("nav-snippets").style.textDecoration = "underline"
            document.getElementById("snippets-nav").style.color = "white"
            document.getElementById("nav-snippets").style.color = "white"
            // } else if (location.slice(0, 12) === "/about") {
            //     document.getElementById("nav-about").style.textDecoration = "underline"
            //     document.getElementById("nav-about").style.color = "white"
            //     document.title = "ABOUT - DEVSHOP"
        } else if (location.slice(0, 9) === "/feedback") {
            document.getElementById("feedback-nav").style.textDecoration = "underline"
            document.getElementById("nav-feedback").style.textDecoration = "underline"
            document.getElementById("feedback-nav").style.color = "white"
            document.getElementById("nav-feedback").style.color = "white"
            document.title = "FEEDBACK - DEVSHOP"
        } else if (location.slice(0, 8) === "/pricing") {
            document.getElementById("pricing-nav").style.textDecoration = "underline"
            document.getElementById("pricing-nav").style.color = "white"
            document.getElementById("nav-pricing").style.textDecoration = "underline"
            document.getElementById("nav-pricing").style.color = "white"
            document.title = "PRICING - DEVSHOP"
        } else if (location.slice(0, 1) === "/") {
            document.title = "DEVSHOP"
        }
    }, [location]);

    const fetchAuth = async () => {
        let {auth} = await import("./firebase.js");
        return auth;
    }

    fetchAuth().then((auth) => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                document.getElementById("account-nav").innerHTML = t('nav.account')
                document.getElementById("nav-account").innerHTML = t('nav.account')
                document.getElementById("profile-nav").onclick = async () => {
                    if (user_data) {
                        let username = fancy_name_to_id(user_data.username);
                        navigate("/users/" + username);
                    }
                }
                document.getElementById("nav-profile").onclick = async () => {
                    if (user_data) {
                        let username = fancy_name_to_id(user_data.username);
                        navigate("/users/" + username);
                    }
                }

                document.getElementById("settings-nav").onclick = () => {
                    navigate("/account");
                }
                document.getElementById("nav-settings").onclick = () => {
                    navigate("/account");
                }
                document.getElementById("sign-out-nav").onclick = () => {
                    auth.signOut().then(() => {
                        window.location.reload()
                    }).catch((error) => {
                        console.log(error);
                    });
                }
                document.getElementById("nav-sign-out").onclick = () => {
                    auth.signOut().then(() => {
                        navigate("/");
                        window.location.reload()
                    }).catch((error) => {
                        console.log(error);
                    });
                }

                document.getElementById("account-nav").onmouseenter = () => {
                    document.getElementById("account-nav-menu").style.display = "block"
                }
                document.getElementById("account-nav").onmouseleave = () => {
                    setTimeout(() => {
                        if (!document.querySelector('#account-nav-menu').matches(":hover") && !document.querySelector('#account-nav').matches(":hover")) {
                            document.getElementById("account-nav-menu").style.display = "none"
                        }
                    }, 250)
                }
                document.getElementById("account-nav-menu").onmouseleave = () => {
                    setTimeout(() => {
                        if (!document.querySelector('#account-nav-menu').matches(":hover") && !document.querySelector('#account-nav').matches(":hover")) {
                            document.getElementById("account-nav-menu").style.display = "none"
                        }
                    }, 250)
                }
            } else {
                const setNoAccount = () => {
                    document.getElementById("account-nav").innerHTML = t('nav.sign_up')
                    document.getElementById("nav-account").innerHTML = t('nav.sign_up')
                    document.getElementById("account-nav").onclick = () => {
                        navigate("/sign-up")
                    }
                    document.getElementById("nav-account").onclick = () => {
                        navigate("/sign-up")
                    }
                }
                if (document.getElementById("account-nav") && document.getElementById("nav-account") && document.getElementById("account-nav").innerHTML && document.getElementById("nav-account").innerHTML) {
                    setNoAccount()
                } else {
                    setTimeout(() => {
                        if (document.getElementById("account-nav") && document.getElementById("nav-account") && document.getElementById("account-nav").innerHTML && document.getElementById("nav-account").innerHTML) {
                            setNoAccount()
                        }
                    }, 100)
                }

            }
        });
    });

    return (
        <>
            <div className="nav-blur">

            </div>
            <div className="nav">
                <h2 onClick={() => navigate("/")} id="nav-title">
                    <span className="nav-txt-title"><img src={navicon} className="nav-icon-title" alt="D"/>
                    EVSHOP
                    </span>
                    {/*<img src={devshop} className="nav-title" alt="DEVSHOP"/>*/}
                </h2>
                <ul className="nav-items" id="nav-items">
                    <li>
                        <Link to="/snippets" id="snippets-nav">SNIPPETS</Link>
                    </li>
                    <li>
                        <Link to="/packages" id="packages-nav">PACKAGES</Link>
                    </li>
                    <li>
                        <Link to="/pricing" id="pricing-nav">{t('nav.pricing')}</Link>
                    </li>
                    <li id="feedback-nav-p">
                        <Link to="/feedback" id="feedback-nav">{t('nav.feedback')}</Link>
                    </li>
                    <li>
                        <Link to="/account" id="account-nav">{t('nav.account')}</Link><br/>
                        <ul id="account-nav-menu">
                            <li id="profile-nav">{t('nav.profile')}</li>
                            <br/>
                            <li id="settings-nav">{t('nav.settings')}</li>
                            <br/>
                            <li id="sign-out-nav">{t('nav.sign_out')}</li>
                        </ul>
                    </li>
                </ul>
                <h4 id="hamburger" onClick={() => {
                    if (document.getElementById("hamburger").innerHTML === "||") {
                        document.getElementById("hamburger").innerHTML = "//"
                        document.getElementById("full-nav").style.left = "0"
                    } else {
                        document.getElementById("hamburger").innerHTML = "||"
                        document.getElementById("full-nav").style.left = "-100%"
                        document.getElementById("full-nav-account").style.left = "-100%"
                    }
                }}>||</h4>
                <div id="full-nav">
                    <ul>
                        <li onClick={() => navigate("/snippets")} id="nav-snippets">SNIPPETS</li>
                        <li onClick={() => navigate("/packages")} id="nav-packages">PACKAGES</li>
                        <li onClick={() => navigate("/pricing")} id="nav-pricing">{t('nav.pricing')}</li>
                        <li onClick={() => navigate("/feedback")} id="nav-feedback">{t('nav.feedback')}</li>
                        <li onClick={() => navigate("/about")} id="nav-about">{t('nav.about')}</li>
                        <li id="nav-account">{t('nav.account')}</li>
                    </ul>
                </div>

                <div id="full-nav-account">
                    <ul>
                        <li onClick={() => {
                            document.getElementById("full-nav-account").style.left = "-100%";
                        }}>{"<== BACK"}</li>
                        <li id="nav-profile">{t('nav.profile')}</li>
                        <li id="nav-settings">{t('nav.settings')}</li>
                        <li id="nav-sign-out">{t('nav.sign_out')}</li>
                    </ul>
                </div>

            </div>
        </>
    )
}