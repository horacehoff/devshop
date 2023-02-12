import "./Navbar.css"
import {auth} from "./firebase.js";
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
        }
    }, []);

    onAuthStateChanged(auth, (user) => {
        if (user) {
            document.getElementById("account").innerHTML = "ACCOUNT"
            document.getElementById("nav-account").innerHTML = "ACCOUNT"
            document.getElementById("account").onclick = () => {
                -navigate("/sign-up");

            }
            document.getElementById("nav-account").onclick = () => {
                navigate("/sign-up")
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
    return (
        <>
            <div className="nav">
                <h2 onClick={() => navigate("/")} id="nav-title">DEVSHOP</h2>
                <h4 id="code-blocks" onClick={() => navigate("/code-blocks")}>CODE BLOCKS</h4>
                <h4 id="packages" onClick={() => navigate("/packages")}>PACKAGES</h4>
                <h4 id="pricing">PRICING</h4>
                <h4 id="about">ABOUT</h4>
                <h4 id="account">LOADING</h4>
                <h4 id="hamburger" onClick={() => {
                    if (document.getElementById("hamburger").innerHTML === "||") {
                        document.getElementById("hamburger").innerHTML = "//"
                        document.getElementById("full-nav").style.left = "0"
                    } else {
                        document.getElementById("hamburger").innerHTML = "||"
                        document.getElementById("full-nav").style.left = "-100%"
                    }
                }}>||</h4>
                <div id="full-nav">
                    <ul>
                        <li onClick={() => navigate("/code-blocks")} id="nav-code-blocks">CODE BLOCKS</li>
                        <li onClick={() => navigate("/packages")} id="nav-packages">PACKAGES</li>
                        <li>PRICING</li>
                        <li>ABOUT</li>
                        <li id="nav-account">ACCOUNT</li>
                    </ul>
                </div>

            </div>
        </>
    )
}