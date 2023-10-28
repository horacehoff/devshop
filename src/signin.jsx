import "./sign-up-in.css"
import {useNavigate} from "react-router-dom";
import {signInWithEmailAndPassword} from "firebase/auth";
import {auth} from "./firebase.js";
import {useState} from "react";


function SignInUser({navigate}, email, password) {
    document.getElementById("sign-in-btn").innerHTML = "LOADING...";
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            navigate("/");
        })
        .catch((error) => {
            document.getElementById("error-msg").style.visibility = "visible"
            switch (error.code) {
                case "auth/wrong-password":
                    document.getElementById("error-msg").innerHTML = "// WRONG PASSWORD";
                    break;
                case "auth/invalid-email":
                    document.getElementById("error-msg").innerHTML = "// INVALID EMAIL";
                    break;
                case "auth/user-not-found":
                    document.getElementById("error-msg").innerHTML = "// USER NOT FOUND";
                    break;
                default:
                    document.getElementById("error-msg").innerHTML = "// " + error.code;
                    break;
            }
            document.getElementById("sign-in-btn").innerHTML = "SIGN_IN";
            console.log(error.code, error.message)
        });
}

export default function SignIn() {
    const navigate = useNavigate()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onBtnSubmit = (e) => {
        e.preventDefault();
        if (email === "") {
            document.getElementById("email").style.borderColor = "rgba(255, 0, 0, 1)"
            setTimeout(() => document.getElementById("email").style.borderColor = "", 2000)
        }
        if (password === "") {
            document.getElementById("password").style.borderColor = "rgba(255, 0, 0, 1)"
            setTimeout(() => document.getElementById("password").style.borderColor = "", 2000)
        }
        if (email !== "" && password !== "") {
            SignInUser({navigate}, email, password)
        }
    }

    return (
        <>
            <br/>
            <br/>
            <br/>
            <br/>
            <h1 className="signup-title">SIGN_IN</h1>
            <p className="signup-signin" onClick={() => navigate("/sign-up")}>// SIGN_UP INSTEAD</p>
            <p className="signup-error" id="error-msg">// AN ERROR OCCURED</p>
            <form>
                <input type="email" id="email" className="txt-input" placeholder="@EMAIL" value={email}
                       onChange={e => setEmail(e.target.value)} autoComplete="email"/><br/><br/>
                <input type="password" id="password" className="txt-input" placeholder="@PASSWORD"
                       value={password}
                       onChange={e => setPassword(e.target.value)} autoComplete="password"/>
                <p className="signup-forgot" onClick={() => navigate("/reset-password")}>FORGOT PASSWORD?</p>
                <button className="primary signup-button" id="sign-in-btn" style={{top: "460px"}}
                        onClick={onBtnSubmit} type="submit">SIGN_IN
                </button>
            </form>
        </>
    )
}