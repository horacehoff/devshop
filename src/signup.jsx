import Navbar from "./Navbar.jsx";
import "./sign-up-in.css"
import {useNavigate} from "react-router-dom";
import {createUserWithEmailAndPassword} from "firebase/auth";
import {auth, db} from "./firebase.js";
import {doc, setDoc} from "firebase/firestore";
import {useState} from "react";

function SignUpUser(email, password, {navigate}) {
    document.getElementById("signup-button").innerHTML = "LOADING.."
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                username: ("user" + user.uid),
                plan: 0,
                owned_packages: [],
                owned_code_blocks: []
            }).then(r => {
                    console.log("registered+db_created+signed-in");
                    navigate("/");
                }
            );
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            document.getElementById("error-msg").style.visibility = "visible";
            switch (error.code) {
                case "auth/invalid-email":
                    document.getElementById("error-msg").innerHTML = "// INVALID EMAIL";
                    break;
                case "auth/user-not-found":
                    document.getElementById("error-msg").innerHTML = "// USER NOT FOUND";
                    break;
                case "auth/weak-password":
                    document.getElementById("error-msg").innerHTML = "// WEAK PASSWORD";
                    break;
                default:
                    document.getElementById("error-msg").innerHTML = "// " + error.code;
                    break;
            }
        });
}

export default function SignUp() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    return (
        <>
            <Navbar/>
            <br/>
            <br/>
            <br/>
            <br/>
            <h1 className="signup-title">SIGN_UP</h1>
            <p className="signup-signin" onClick={() => navigate("/sign-in")}>// SIGN_IN INSTEAD</p>
            <p className="signup-error" id="error-msg">// AN ERROR OCCURED</p>
            <input type="email" id="email" className="signup-input" placeholder="@EMAIL" value={email}
                   onChange={e => setEmail(e.target.value)}/><br/><br/>
            <input type="password" id="password" className="signup-input" placeholder="@PASSWORD" value={password}
                   onChange={e => setPassword(e.target.value)}/>
            <button className="signup-button" id="signup-button"
                    onClick={() => SignUpUser(email, password, {navigate})}>SIGN_UP
            </button>
        </>
    )
}