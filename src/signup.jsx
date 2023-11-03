import "./sign-up-in.css"
import {useNavigate} from "react-router-dom";
import {createUserWithEmailAndPassword} from "firebase/auth";
import {auth, db} from "./firebase.js";
import {collection, doc, getDocs, query, setDoc, where} from "firebase/firestore";
import {useState} from "react";
import fancy_name_to_id from "./utility.js";
import data from "./signUpIn.json"
import i18n from "i18next";
import {useTranslation} from "react-i18next";

export async function checkIfUsernameExists(username) {
    const q = query(collection(db, "users"), where("username", "==", fancy_name_to_id(username)));
    const querySnapshot = await getDocs(q);
    return querySnapshot.size > 0;
}

function SignUpUser(username, email, password, {navigate}, {t}) {
    let usernameExistsPromise = checkIfUsernameExists(username).then(e => {
        if (username === "") {
            document.getElementById("error-msg").style.visibility = "visible";
            document.getElementById("error-msg").innerHTML = "// " + t("auth.invalid_username");
            return;
        } else if (e) {
            document.getElementById("error-msg").style.visibility = "visible";
            document.getElementById("error-msg").innerHTML = "// " + t("auth.username_exists");
            return;
        } else if (email === "") {
            document.getElementById("error-msg").style.visibility = "visible";
            document.getElementById("error-msg").innerHTML = "// " + t("auth.invalid_email");
            return;
        } else if (password === "") {
            document.getElementById("error-msg").style.visibility = "visible";
            document.getElementById("error-msg").innerHTML = "// " + t("auth.invalid_password");
            return;
        } else if (username.length > 20) {
            document.getElementById("error-msg").style.visibility = "visible";
            document.getElementById("error-msg").innerHTML = "// " + t("auth.username_too_long");
            return;
        }
        document.getElementById("signup-button").innerHTML = t("auth.loading") + ".."
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                setDoc(doc(db, "users", user.uid), {
                    uid: user.uid,
                    username: fancy_name_to_id(username),
                    plan: 0,
                    owned_packages: [],
                    owned_code_blocks: [],
                    bio: "Hi, I'm new to DEVSHOP!",
                    github: "",
                    pfp_path: "",
                    banner_path: "",
                    followers: [],
                    following: [],
                    pkgdownloads: [],
                    codedownloads: []
                }).then(r => {
                        console.log("registered+db_created+signed-in");
                        navigate("/");
                    window.location.reload();
                    }
                );
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                document.getElementById("error-msg").style.visibility = "visible";
                switch (error.code) {
                    case "auth/invalid-email":
                        document.getElementById("error-msg").innerHTML = "// " + t("auth.invalid_email");
                        break;
                    case "auth/user-not-found":
                        document.getElementById("error-msg").innerHTML = "// " + t("auth.user_not_found");
                        break;
                    case "auth/weak-password":
                        document.getElementById("error-msg").innerHTML = "// " + t("auth.weak_password");
                        break;
                    default:
                        document.getElementById("error-msg").innerHTML = "// " + error.code;
                        break;
                }
            });
    })

}

export default function SignUp() {
    i18n.addResourceBundle("en", "auth", data.en)
    i18n.addResourceBundle("fr", "auth", data.fr)
    const {t} = useTranslation("auth");


    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");

    const onBtnSubmit = (e) => {
        e.preventDefault();
        if (username === "") {
            document.getElementById("username").style.borderColor = "rgba(255, 0, 0, 1)"
            setTimeout(() => document.getElementById("username").style.borderColor = "", 2000)
        }
        if (email === "") {
            document.getElementById("email").style.borderColor = "rgba(255, 0, 0, 1)"
            setTimeout(() => document.getElementById("email").style.borderColor = "", 2000)
        }
        if (password === "") {
            document.getElementById("new-password").style.borderColor = "rgba(255, 0, 0, 1)"
            setTimeout(() => document.getElementById("new-password").style.borderColor = "", 2000)
        }
        if (username !== "" && email !== "" && password !== "") {
            SignUpUser(username, email, password, {navigate}, {t})
        }
    }

    return (
        <>
            <br/>
            <br/>
            <br/>
            <br/>
            <h1 className="signup-title">{t("auth.sign_up")}</h1>
            <p className="signup-signin" onClick={() => navigate("/sign-in")}>{t("auth.instead_sign_in")}</p>
            <p className="signup-error" id="error-msg">// {t("auth.error")}</p>
            <form className="sign-form">
                <input type="text" id="username" className="txt-input" placeholder={t("auth.usernameholder")}
                       value={username}
                       onChange={e => setUsername(e.target.value)} autoComplete="username"/><br/><br/>
                <input type="email" id="email" className="txt-input" placeholder={t("auth.emailholder")} value={email}
                       onChange={e => setEmail(e.target.value)} autoComplete="email"/><br/><br/>
                <input type="password" id="new-password" className="txt-input" placeholder={t("auth.passwordholder")}
                       value={password}
                       onChange={e => setPassword(e.target.value)} autoComplete="new-password"/>
                <button className="primary signup-button" id="signup-button"
                        onClick={onBtnSubmit} type="button">{t("auth.sign_up_btn")}
                </button>
            </form>

        </>
    )
}