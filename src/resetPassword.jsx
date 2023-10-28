import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {sendPasswordResetEmail} from "firebase/auth";
import {auth} from "./firebase.js";
import "./resetPassword.css"

export default function ResetPassword() {
    const navigate = useNavigate()
    const [email, setEmail] = useState("");

    return (
        <>
            <h1 className="signup-title reset-pwd-title" style={{marginTop: "200px"}}>RESET_PASSWORD</h1>
            <p className="signup-signin" onClick={() => navigate("/sign-in")}>SIGN_IN INSTEAD</p>
            <p className="signup-error" id="error-msg">// AN ERROR OCCURED</p>
            <input type="email" id="email" className="txt-input" placeholder="@EMAIL" value={email}
                   onChange={e => setEmail(e.target.value)}/><br/><br/>
            <button className="primary signup-button" id="reset-pwd-btn"
                    onClick={async () => {
                        await sendPasswordResetEmail(auth, email).then(() => {
                            document.getElementById("reset-pwd-btn").innerHTML = "✅ CHECK YOUR MAIL"
                            setTimeout(() =>
                                    navigate("/sign-in")
                                , 2000)
                        })
                    }}>RESET_PASSWORD
            </button>
        </>

    )
}