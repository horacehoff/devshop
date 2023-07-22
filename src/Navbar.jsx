import "./Navbar.css"
import {onAuthStateChanged} from "firebase/auth"
import {Link, useLocation, useNavigate} from "react-router-dom";
import {useEffect} from "react";
import fancy_name_to_id from "./utility.js";
import {user_data} from "./firebase.js";
import navicon from "/naviconwhite.png"


export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation().pathname;
    const effectlocation = useLocation();

    const resetStyles = () => {
        document.getElementById("packages").style.textDecoration = "none"
        document.getElementById("nav-packages").style.textDecoration = "none"
        document.getElementById("packages").style.color = "rgba(255, 255, 255, .75)"
        document.getElementById("nav-packages").style.color = "rgba(255, 255, 255, .75)"
        document.getElementById("account").style.textDecoration = "none"
        document.getElementById("nav-account").style.textDecoration = "none"
        document.getElementById("account").style.color = "rgba(255, 255, 255, .75)"
        document.getElementById("nav-account").style.color = "rgba(255, 255, 255, .75)"
        document.getElementById("snippets").style.textDecoration = "none"
        document.getElementById("nav-snippets").style.textDecoration = "none"
        document.getElementById("snippets").style.color = "rgba(255, 255, 255, .75)"
        document.getElementById("nav-snippets").style.color = "rgba(255, 255, 255, .75)"
        document.getElementById("about").style.textDecoration = "none"
        document.getElementById("nav-about").style.textDecoration = "none"
        document.getElementById("about").style.color = "rgba(255, 255, 255, .75)"
        document.getElementById("nav-about").style.color = "rgba(255, 255, 255, .75)"
        document.getElementById("pricing").style.textDecoration = "none"
        document.getElementById("nav-pricing").style.textDecoration = "none"
        document.getElementById("pricing").style.color = "rgba(255, 255, 255, .75)"
        document.getElementById("nav-pricing").style.color = "rgba(255, 255, 255, .75)"

        isMouseHover = false
        document.getElementById("profile").style.display = "none"
        document.getElementById("settings").style.display = "none"
        document.getElementById("sign-out").style.display = "none"

        document.getElementById("hamburger").innerHTML = "||"
        document.getElementById("full-nav").style.left = "-100%"
        document.getElementById("full-nav-account").style.left = "-100%"
    }

    useEffect(() => {
        resetStyles()
        if (location.slice(0, 9) === "/packages") {
            document.getElementById("packages").style.textDecoration = "underline"
            document.getElementById("nav-packages").style.textDecoration = "underline"
            document.getElementById("packages").style.color = "white"
            document.getElementById("nav-packages").style.color = "white"
        } else if (location.slice(0, 8) === "/sign-up" || location.slice(0, 8) === "/sign-in") {
            document.getElementById("account").style.textDecoration = "underline"
            document.getElementById("nav-account").style.textDecoration = "underline"
            document.getElementById("account").style.color = "white"
            document.getElementById("nav-account").style.color = "white"
            document.title = "SIGN UP/IN - DEVSHOP"
        } else if (location.slice(0, 9) === "/snippets") {
            document.getElementById("snippets").style.textDecoration = "underline"
            document.getElementById("nav-snippets").style.textDecoration = "underline"
            document.getElementById("snippets").style.color = "white"
            document.getElementById("nav-snippets").style.color = "white"
        } else if (location.slice(0, 12) === "/about") {
            document.getElementById("about").style.textDecoration = "underline"
            document.getElementById("nav-about").style.textDecoration = "underline"
            document.getElementById("about").style.color = "white"
            document.getElementById("nav-about").style.color = "white"
            document.title = "ABOUT - DEVSHOP"
        } else if (location.slice(0, 8) === "/pricing") {
            document.getElementById("pricing").style.textDecoration = "underline"
            document.getElementById("pricing").style.color = "white"
            document.getElementById("nav-pricing").style.textDecoration = "underline"
            document.getElementById("nav-pricing").style.color = "white"
            document.title = "PRICING - DEVSHOP"
        } else if (location.slice(0, 1) === "/") {
            document.title = "DEVSHOP"
        }
    }, [location]);

    const showAccountPages = () => {
        console.log("account mouse enter");
        let account_pos = document.getElementById("account").getBoundingClientRect();
        document.getElementById("profile").style.display = "block"
        document.getElementById("settings").style.display = "block"
        document.getElementById("sign-out").style.display = "block"
        // set their positions as fixed
        document.getElementById("profile").style.position = "fixed"
        document.getElementById("settings").style.position = "fixed"
        document.getElementById("sign-out").style.position = "fixed"
        document.getElementById("profile").style.top = (account_pos.top + 30 + "px")
        document.getElementById("profile").style.left = (account_pos.left + "px")
        document.getElementById("settings").style.top = (account_pos.top + 60 + "px")
        document.getElementById("settings").style.left = (account_pos.left + "px")
        document.getElementById("sign-out").style.top = (account_pos.top + 90 + "px")
        document.getElementById("sign-out").style.left = (account_pos.left + "px")
    }

    let isMouseHover = false

    const hideAccountPages = () => {
        // add a small delay to the hideAccountPages function so that the user has time to move their mouse from the account button to the account options
        setTimeout(() => {
            console.log("account mouse leave");
            // check if the mouse is over the account button or the account options
            if (!isMouseHover) {
                document.getElementById("profile").style.display = "none"
                document.getElementById("settings").style.display = "none"
                document.getElementById("sign-out").style.display = "none"
            }
        }, 250)
    }

    const fetchAuth = async () => {
        let {auth} = await import("./firebase.js");
        return auth;
    }

    fetchAuth().then((auth) => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                document.getElementById("account").innerHTML = "ACCOUNT"
                document.getElementById("nav-account").innerHTML = "ACCOUNT"
                document.getElementById("profile").onclick = async () => {
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

                document.getElementById("settings").onclick = () => {
                    navigate("/account");
                }
                document.getElementById("nav-settings").onclick = () => {
                    navigate("/account");
                }
                document.getElementById("sign-out").onclick = () => {
                    auth.signOut().then(() => {
                        window.location.reload()
                    }).catch((error) => {
                        console.log(error);
                    });
                }
                document.getElementById("nav-sign-out").onclick = () => {
                    auth.signOut().then(() => {
                        navigate("/");
                    }).catch((error) => {
                        console.log(error);
                    });
                }

                document.getElementById("account").onmouseenter = () => showAccountPages()
                document.getElementById("account").onmouseleave = () => hideAccountPages()

                // create a snippet below that will keep the three account options visible when the mouse is over them and hide them when the mouse is not over them
                document.getElementById("profile").onmouseenter = () => {
                    isMouseHover = true
                    showAccountPages()
                    document.getElementById("profile").style.color = "white"
                }
                document.getElementById("profile").onmouseleave = () => {
                    isMouseHover = false
                    hideAccountPages()
                    document.getElementById("profile").style.color = "#ababab"
                }
                document.getElementById("settings").onmouseenter = () => {
                    isMouseHover = true
                    showAccountPages()
                    document.getElementById("settings").style.color = "white"
                }
                document.getElementById("settings").onmouseleave = () => {
                    isMouseHover = false
                    hideAccountPages()
                    document.getElementById("settings").style.color = "#ababab"
                }
                document.getElementById("sign-out").onmouseenter = () => {
                    isMouseHover = true
                    showAccountPages()
                    document.getElementById("sign-out").style.color = "white"
                }
                document.getElementById("sign-out").onmouseleave = () => {
                    isMouseHover = false
                    hideAccountPages()
                    document.getElementById("sign-out").style.color = "#ababab"
                }

                document.getElementById("nav-account").onclick = () => {
                    document.getElementById("full-nav-account").style.left = "0";
                }


            } else {
                document.getElementById("account").innerHTML = "SIGN_UP"
                document.getElementById("nav-account").innerHTML = "SIGN_UP"
                document.getElementById("account").onclick = () => {
                    navigate("/sign-up")
                }
                document.getElementById("nav-account").onclick = () => {
                    navigate("/sign-up")
                }
            }
        });
    });

    return (
        <>
            <div className="nav">
                <h2 onClick={() => navigate("/")} id="nav-title">
                    <span className="nav-txt-title"><img src={navicon} className="nav-icon-title"/>
                    EVSHOP
                    </span>
                </h2>
                <Link id="snippets" to="/snippets" className="nav-link">SNIPPETS</Link>
                <Link id="packages" to="/packages" className="nav-link">PACKAGES</Link>
                <Link id="pricing" to="/pricing" className="nav-link">PRICING</Link>
                <Link id="about" to="/about" className="nav-link">ABOUT</Link>
                <h4 id="account" className="nav-link">LOADING</h4>
                <h4 id="profile" style={{position: "absolute", display: "none", color: "#ababab"}}
                    className="nav-link">PROFILE</h4>
                <h4 id="settings" style={{position: "absolute", display: "none", color: "#ababab"}}
                    className="nav-link">SETTINGS</h4>
                <h4 id="sign-out" style={{position: "absolute", display: "none", color: "#ababab"}}
                    className="nav-link">SIGN OUT</h4>
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
                        <li onClick={() => navigate("/pricing")} id="nav-pricing">PRICING</li>
                        <li onClick={() => navigate("/about")} id="nav-about">ABOUT</li>
                        <li id="nav-account">ACCOUNT</li>
                    </ul>
                </div>

                <div id="full-nav-account">
                    <ul>
                        <li onClick={() => {
                            document.getElementById("full-nav-account").style.left = "-100%";
                        }}>{"<== BACK"}</li>
                        <li id="nav-profile">PROFILE</li>
                        <li id="nav-settings">SETTINGS</li>
                        <li id="nav-sign-out">SIGN OUT</li>
                    </ul>
                </div>

            </div>
        </>
    )
}