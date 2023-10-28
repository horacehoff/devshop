import "./Feedback.css"
import {createRef, useState} from "react";
import Popup from "reactjs-popup";
import {doc, setDoc} from "firebase/firestore";
import {db} from "./firebase.js";
import {useNavigate} from "react-router-dom";
import {Helmet} from "react-helmet";
import Footer from "./Footer.jsx";

function validateEmail(input) {
    const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return !!input.match(validRegex);
}

async function submitFeedback(email, feedback) {
    await setDoc(doc(db, "feedback", email + "+" + Date.now()), {
        email: email,
        feedback: feedback,
        timestamp: Date.now()
    })
}

export default function Feedback() {
    const [email, setEmail] = useState("");
    const [feedback, setFeedback] = useState("");
    let emailpopupref = createRef();
    let successpopupref = createRef();

    const navigate = useNavigate();
    return (
        <>
            <Helmet>
                <meta
                    content="Provide feedback about DEVSHOP and help build the site"
                    name="description"/>
                <meta content="Feedback" name="title"/>


                <meta content="https://dev-shop.vercel.app/feedback" property="twitter:url"/>
                <meta content="Feedback" property="twitter:title"/>
                <meta content="Provide feedback about DEVSHOP and help build the site"
                      property="twitter:description"/>


                <meta content="https://dev-shop.vercel.app/feedback" property="og:url"/>
                <meta content="Feedback" property="og:title"/>
                <meta content="Provide feedback about DEVSHOP and help build the site"
                      property="og:description"/>
            </Helmet>
            <Popup ref={emailpopupref}>
                <h3 className="rating-popup-title">ERROR</h3>
                <h5 className="popup-signin-txt feedback-popup-signin-txt">INVALID EMAIL</h5>
            </Popup>
            <Popup ref={successpopupref} onClose={() => {
                navigate("/")
            }}>
                <h3 className="rating-popup-title">SUBMITTED</h3>
                <h5 className="popup-signin-txt feedback-popup-signin-txt">Your feedback is
                    greatly appreciated. It helps improve the site. Thank you!</h5>
            </Popup>
            <h1 className="pricing-title">Feedback</h1>
            <h3 className="pricing-parentsubtitle">HELP BUILD THE SITE BY SHARING YOUR FEEDBACK</h3>
            <br/>
            <div className="feedback-container">
                <input type="email" placeholder="@EMAIL" id="email" className="txt-input" value={email}
                       onChange={e => setEmail(e.target.value)}/>
                <textarea placeholder="@FEEDBACK" id="feedback" className="txt-input feedback-input" value={feedback}
                          onChange={e => setFeedback(e.target.value)}></textarea>
                <button className="primary feedback-submit" onClick={() => {
                    if (email === "") {
                        document.getElementById("email").style.borderColor = "rgba(255, 0, 0, 1)"
                        setTimeout(() => document.getElementById("email").style.borderColor = "", 2000)
                    }
                    if (feedback === "") {
                        document.getElementById("feedback").style.borderColor = "rgba(255, 0, 0, 1)"
                        setTimeout(() => document.getElementById("feedback").style.borderColor = "", 2000)
                    }
                    if (email !== "" && feedback !== "") {
                        if (validateEmail(email)) {
                            document.getElementById("feedback-submit-btn").innerHTML = "SUBMITTING...";
                            submitFeedback(email, feedback).then(() => {
                                successpopupref.current.open();
                                setTimeout(() => {
                                    navigate("/");
                                }, 3000)
                            })
                        } else {
                            emailpopupref.current.open();
                        }
                    }
                }} id="feedback-submit-btn">SUBMIT
                </button>
            </div>
            <br/><br/>
            <Footer/>
        </>
    )
}