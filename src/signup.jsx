import Navbar from "./Navbar.jsx";
import "./signup.css"

export default function SignUp() {
    return (
        <>
            <Navbar/>
            <br/>
            <br/>
            <br/>
            <br/>
            <h1 className="signup-title">SIGN_UP</h1>
            <p className="signup-signin">// SIGN_IN INSTEAD</p>
            <p className="signup-error">// AN ERROR OCCURED</p>
            <input type="email" id="email" className="signup-input" placeholder="@EMAIL"/><br/><br/>
            <input type="password" id="password" className="signup-input" placeholder="@PASSWORD"/>
            <button className="signup-button">SIGN_UP</button>
        </>
    )
}