import Navbar from "./Navbar.jsx";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {sendPasswordResetEmail} from "firebase/auth";
import {auth} from "./firebase.js";
import './popup.css';

export default function ResetPassword() {
    const navigate = useNavigate()
    const [email, setEmail] = useState("");

    return (
        <>
            <Navbar/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <h1 className="signup-title">RESET_PASSWORD</h1>
            <p className="signup-signin" onClick={() => navigate("/sign-in")}>// SIGN_IN INSTEAD</p>
            <p className="signup-error" id="error-msg">// AN ERROR OCCURED</p>
            <input type="email" id="email" className="txt-input" placeholder="@EMAIL" value={email}
                   onChange={e => setEmail(e.target.value)}/><br/><br/>
            <button className="signup-button" style={{top: "460px"}}
                    onClick={async () => {
                        await sendPasswordResetEmail(auth, email).then(() => {
                            navigate("/sign-in")
                        })
                    }}>RESET_PASSWORD
            </button>
        </>

    )
}