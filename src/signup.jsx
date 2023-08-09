import "./sign-up-in.css"
import {useNavigate} from "react-router-dom";
import {createUserWithEmailAndPassword} from "firebase/auth";
import {auth, db} from "./firebase.js";
import {collection, doc, getDocs, query, setDoc, where} from "firebase/firestore";
import {useState} from "react";
import fancy_name_to_id from "./utility.js";

export async function checkIfUsernameExists(username) {
    const q = query(collection(db, "users"), where("username", "==", fancy_name_to_id(username)));
    const querySnapshot = await getDocs(q);
    return querySnapshot.size > 0;
}

function SignUpUser(username, email, password, {navigate}) {
    let usernameExistsPromise = checkIfUsernameExists(username).then(e => {
        if (username === "") {
            document.getElementById("error-msg").style.visibility = "visible";
            document.getElementById("error-msg").innerHTML = "INVALID USERNAME";
            return;
        } else if (e) {
            document.getElementById("error-msg").style.visibility = "visible";
            document.getElementById("error-msg").innerHTML = "// USERNAME ALREADY EXISTS";
            return;
        } else if (email === "") {
            document.getElementById("error-msg").style.visibility = "visible";
            document.getElementById("error-msg").innerHTML = "// INVALID EMAIL";
            return;
        } else if (password === "") {
            document.getElementById("error-msg").style.visibility = "visible";
            document.getElementById("error-msg").innerHTML = "// INVALID PASSWORD";
            return;
        } else if (username.length > 20) {
            document.getElementById("error-msg").style.visibility = "visible";
            document.getElementById("error-msg").innerHTML = "// USERNAME TOO LONG";
            return;
        }
        document.getElementById("signup-button").innerHTML = "LOADING.."
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
                    banner_path: ""
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
    })

}

export default function SignUp() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");

    const onBtnSubmit = (e) => {
        e.preventDefault();
        SignUpUser(username, email, password, {navigate})
    }

    return (
        <>
            <br/>
            <br/>
            <br/>
            <br/>
            <h1 className="signup-title">SIGN_UP</h1>
            <p className="signup-signin" onClick={() => navigate("/sign-in")}>// SIGN_IN INSTEAD</p>
            <p className="signup-error" id="error-msg">// AN ERROR OCCURED</p>
            <form>
                <input type="text" id="username" className="txt-input glassinput" placeholder="@USERNAME"
                       value={username}
                       onChange={e => setUsername(e.target.value)} autoComplete="username"/><br/><br/>
                <input type="email" id="email" className="txt-input glassinput" placeholder="@EMAIL" value={email}
                       onChange={e => setEmail(e.target.value)} autoComplete="email"/><br/><br/>
                <input type="password" id="password" className="txt-input glassinput" placeholder="@PASSWORD"
                       value={password}
                       onChange={e => setPassword(e.target.value)} autoComplete="new-password"/>
                <button className="primary signup-button" id="signup-button" style={{marginTop: "65px"}}
                        onClick={onBtnSubmit} type="button">SIGN_UP
                </button>
            </form>
        </>
    )
}