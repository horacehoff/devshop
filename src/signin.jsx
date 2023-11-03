import "./sign-up-in.css"
import {useNavigate} from "react-router-dom";
import {signInWithEmailAndPassword} from "firebase/auth";
import {auth} from "./firebase.js";
import {useState} from "react";
import data from "./signUpIn.json"
import i18n from "i18next";
import {useTranslation} from "react-i18next";


function SignInUser({navigate}, email, password, {t}) {
    document.getElementById("sign-in-btn").innerHTML = t("auth.loading") + "...";
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            navigate("/");
        })
        .catch((error) => {
            document.getElementById("error-msg").style.visibility = "visible"
            switch (error.code) {
                case "auth/wrong-password":
                    document.getElementById("error-msg").innerHTML = "// " + t("auth.wrong_password");
                    break;
                case "auth/invalid-email":
                    document.getElementById("error-msg").innerHTML = "// " + t("invalid_email");
                    break;
                case "auth/user-not-found":
                    document.getElementById("error-msg").innerHTML = "// " + t("auth.user_not_found");
                    break;
                default:
                    document.getElementById("error-msg").innerHTML = "// " + error.code;
                    break;
            }
            document.getElementById("sign-in-btn").innerHTML = t("auth.sign_in_btn");
            console.log(error.code, error.message)
        });
}

export default function SignIn() {
    i18n.addResourceBundle("en", "auth", data.en)
    i18n.addResourceBundle("fr", "auth", data.fr)
    const {t} = useTranslation("auth");


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
            document.getElementById("current-password").style.borderColor = "rgba(255, 0, 0, 1)"
            setTimeout(() => document.getElementById("current-password").style.borderColor = "", 2000)
        }
        if (email !== "" && password !== "") {
            SignInUser({navigate}, email, password, {t})
        }
    }

    return (
        <>
            <br/>
            <br/>
            <br/>
            <br/>
            <h1 className="signup-title">{t("auth.sign_in")}</h1>
            <p className="signup-signin" onClick={() => navigate("/sign-up")}>{t("auth.instead_sign_up")}</p>
            <p className="signup-error" id="error-msg">{t("auth.error")}</p>
            <form className="sign-form">
                <input type="email" id="email" className="txt-input" placeholder={t("auth.emailholder")} value={email}
                       onChange={e => setEmail(e.target.value)} autoComplete="email"/><br/><br/>
                <input type="password" id="current-password" className="txt-input"
                       placeholder={t("auth.passwordholder")}
                       value={password}
                       onChange={e => setPassword(e.target.value)} autoComplete="current-password"/>
                <p className="signup-forgot" onClick={() => navigate("/reset-password")}>{t("auth.forgot_password")}</p>
                <button className="primary signup-button" id="sign-in-btn"
                        onClick={onBtnSubmit} type="submit">{t("auth.sign_in_btn")}
                </button>
            </form>
        </>
    )
}