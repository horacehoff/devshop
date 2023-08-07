import "./Feedback.css"
import {createRef, useState} from "react";
import Popup from "reactjs-popup";
import {doc, setDoc} from "firebase/firestore";
import {db} from "./firebase.js";
import {useNavigate} from "react-router-dom";

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
    let fieldpopupref = createRef();
    let successpopupref = createRef();
    let descref = createRef();

    const navigate = useNavigate();
    return (
        <>
            <Popup ref={emailpopupref}>
                <h3 className="rating-popup-title">ERROR</h3>
                <h5 className="popup-signin-txt"
                    style={{fontWeight: "400", fontSize: "16px", margin: "0", marginBottom: "10px"}}>Your email looks
                    invalid.</h5>
            </Popup>
            <Popup ref={fieldpopupref}>
                <h3 className="rating-popup-title">ERROR</h3>
                <h5 className="popup-signin-txt"
                    style={{fontWeight: "400", fontSize: "16px", margin: "0", marginBottom: "10px"}}>Please fill in the
                    required fields.</h5>
            </Popup>
            <Popup ref={successpopupref} onClose={() => {
                navigate("/")
            }}>
                <h3 className="rating-popup-title">SUBMITTED</h3>
                <h5 className="popup-signin-txt"
                    style={{fontWeight: "400", fontSize: "16px", margin: "0", marginBottom: "10px"}}>Your feedback is
                    greatly appreciated. It helps improve the site. Thank you!</h5>
            </Popup>
            <h1 className="pricing-title">Feedback</h1>
            <h3 className="pricing-parentsubtitle">Help build the site by sharing your feedback</h3>
            <br/>
            <div className="feedback-container">
                <input type="email" placeholder="@EMAIL" className="txt-input glassinput" value={email}
                       onChange={e => setEmail(e.target.value)} style={{margin: "0"}}/>
                <textarea placeholder="@FEEDBACK" className="txt-input feedback-input glassinput" value={feedback}
                          onChange={e => setFeedback(e.target.value)} style={{marginLeft: "0"}}></textarea>
                <button className="primary feedback-submit" onClick={() => {
                    if (email !== "" || feedback !== "") {
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
                    } else {
                        fieldpopupref.current.open();
                    }
                }} id="feedback-submit-btn">SUBMIT
                </button>
            </div>
        </>
    )
}