import "./Navbar.css"
import {onAuthStateChanged} from "firebase/auth"
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect} from "react";

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation().pathname;
    useEffect(() => {
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
        } else if (location.slice(0, 12) === "/code-blocks") {
            document.getElementById("code-blocks").style.textDecoration = "underline"
            document.getElementById("nav-code-blocks").style.textDecoration = "underline"
            document.getElementById("code-blocks").style.color = "white"
            document.getElementById("nav-code-blocks").style.color = "white"
        } else if (location.slice(0, 12) === "/about") {
            document.getElementById("about").style.textDecoration = "underline"
            document.getElementById("nav-about").style.textDecoration = "underline"
            document.getElementById("about").style.color = "white"
            document.getElementById("nav-about").style.color = "white"
        } else if (location.slice(0, 8) === "/pricing") {
            document.getElementById("pricing").style.textDecoration = "underline"
            document.getElementById("pricing").style.color = "white"
            document.getElementById("nav-pricing").style.textDecoration = "underline"
            document.getElementById("nav-pricing").style.color = "white"

        }
    }, []);

    const showAccountPages = () => {
        console.log("account mouse enter");
        let account_pos = document.getElementById("account").getBoundingClientRect();
        document.getElementById("profile").style.display = "block"
        document.getElementById("settings").style.display = "block"
        document.getElementById("sign-out").style.display = "block"
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
                document.getElementById("settings").onclick = () => {
                    navigate("/account");
                }
                document.getElementById("sign-out").onclick = () => {
                    auth.signOut().then(() => {
                        navigate("/");
                    }).catch((error) => {
                        console.log(error);
                    });
                }

                document.getElementById("account").onmouseenter = () => showAccountPages()
                document.getElementById("account").onmouseleave = () => hideAccountPages()

                // create a code block below that will keep the three account options visible when the mouse is over them and hide them when the mouse is not over them
                document.getElementById("profile").onmouseenter = () => {
                    isMouseHover = true
                    showAccountPages()
                    document.getElementById("profile").style.color = "white"
                }
                document.getElementById("profile").onmouseleave = () => {
                    isMouseHover = false
                    hideAccountPages()
                    document.getElementById("profile").style.color = "#606060"
                }
                document.getElementById("settings").onmouseenter = () => {
                    isMouseHover = true
                    showAccountPages()
                    document.getElementById("settings").style.color = "white"
                }
                document.getElementById("settings").onmouseleave = () => {
                    isMouseHover = false
                    hideAccountPages()
                    document.getElementById("settings").style.color = "#606060"
                }
                document.getElementById("sign-out").onmouseenter = () => {
                    isMouseHover = true
                    showAccountPages()
                    document.getElementById("sign-out").style.color = "white"
                }
                document.getElementById("sign-out").onmouseleave = () => {
                    isMouseHover = false
                    hideAccountPages()
                    document.getElementById("sign-out").style.color = "#606060"
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
                <h2 onClick={() => navigate("/")} id="nav-title">DEVSHOP</h2>
                <h4 id="code-blocks" onClick={() => navigate("/code-blocks")}>CODE BLOCKS</h4>
                <h4 id="packages" onClick={() => navigate("/packages")}>PACKAGES</h4>
                <h4 id="pricing" onClick={() => navigate("/pricing")}>PRICING</h4>
                <h4 id="about" onClick={() => navigate("/about")}>ABOUT</h4>
                <h4 id="account">LOADING</h4>
                <h4 id="profile" style={{position: "absolute", display: "none", color: "#606060"}}>PROFILE</h4>
                <h4 id="settings" style={{position: "absolute", display: "none", color: "#606060"}}>SETTINGS</h4>
                <h4 id="sign-out" style={{position: "absolute", display: "none", color: "#606060"}}>SIGN OUT</h4>
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
                        <li onClick={() => navigate("/code-blocks")} id="nav-code-blocks">CODE BLOCKS</li>
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
                        <li onClick={() => navigate("/code-blocks")}>PROFILE</li>
                        <li onClick={() => navigate("/packages")}>SETTINGS</li>
                        <li onClick={() => navigate("/pricing")}>SIGN OUT</li>
                    </ul>
                </div>

            </div>
        </>
    )
}