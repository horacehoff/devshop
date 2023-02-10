import "./Navbar.css"
import {auth} from "./firebase.js";
import {onAuthStateChanged} from "firebase/auth"
import {useNavigate} from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();
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

                <h2 onClick={() => navigate("/")}>DEVSHOP</h2>
                <h4 id="code-blocks">CODE BLOCKS</h4>
                <h4 id="packages">PACKAGES</h4>
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
                        <li>CODE BLOCKS</li>
                        <li>PACKAGES</li>
                        <li>PRICING</li>
                        <li>ABOUT</li>
                        <li id="nav-account">ACCOUNT</li>
                    </ul>
                </div>

            </div>
        </>
    )
}