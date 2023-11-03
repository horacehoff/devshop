import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {sendPasswordResetEmail} from "firebase/auth";
import {auth} from "./firebase.js";
import "./resetPassword.css"
import data from "./resetPassword.json"
import i18n from "i18next";
import {useTranslation} from "react-i18next";

export default function ResetPassword() {
    i18n.addResourceBundle("en", "reset", data.en)
    i18n.addResourceBundle("fr", "reset", data.fr)
    const {t} = useTranslation("reset");


    const navigate = useNavigate()
    const [email, setEmail] = useState("");

    return (
        <>
            <form className="reset-form">
                <h1 className="signup-title reset-pwd-title">{t("reset.reset")}</h1>
                <p className="signup-signin" onClick={() => navigate("/sign-in")}>{t("reset.instead_sign_in")}</p>
                <p className="signup-error" id="error-msg">{t("reset.error")}D</p>
                <input type="email" id="email" className="txt-input" placeholder={t("reset.emailholder")} value={email}
                       onChange={e => setEmail(e.target.value)}/><br/><br/>
                <button className="primary signup-button" id="reset-pwd-btn"
                        onClick={async () => {
                            await sendPasswordResetEmail(auth, email).then(() => {
                                document.getElementById("reset-pwd-btn").innerHTML = "✅ " + t("reset.check")
                                setTimeout(() =>
                                        navigate("/sign-in")
                                    , 2000)
                            })
                        }}>{t("reset.reset_btn")}
                </button>
            </form>

        </>

    )
}