import "./Feedback.css"
import {createRef, useEffect, useState} from "react";
import Popup from "reactjs-popup";
import {doc, setDoc} from "firebase/firestore";
import {db} from "./firebase.js";
import {useNavigate} from "react-router-dom";
import {Helmet} from "react-helmet";
import data from "./Feedback.json"
import i18n from "i18next";
import {useTranslation} from "react-i18next";

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

    i18n.addResourceBundle("en", "feedback", data.en)
    i18n.addResourceBundle("fr", "feedback", data.fr)
    const {t} = useTranslation("feedback");

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
                <h3 className="rating-popup-title">{t('feedback.error')}</h3>
                <h5 className="popup-signin-txt feedback-popup-signin-txt">{t('feedback.invalid_email')}</h5>
            </Popup>
            <Popup ref={successpopupref} onClose={() => {
                navigate("/")
            }}>
                <h3 className="rating-popup-title">{t('feedback.submitted')}</h3>
                <h5 className="popup-signin-txt feedback-popup-signin-txt">{t('feedback.submitted_txt_1')}<br/>{t('feedback.submitted_txt_2')}
                </h5>
            </Popup>
            <h1 className="pricing-title">{t('feedback.feedback')}</h1>
            <h3 className="pricing-parentsubtitle">{t('feedback.feedbacksub')}</h3>
            <br/>
            <div className="feedback-container">
                <input type="email" placeholder={t('feedback.emailholder')} id="email" className="txt-input"
                       value={email}
                       onChange={e => setEmail(e.target.value)}/>
                <textarea placeholder={t('feedback.feedbackholder')} id="feedback" className="txt-input feedback-input"
                          value={feedback}
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
                            document.getElementById("feedback-submit-btn").innerHTML = t('feedback.submitting') + "...";
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
                }} id="feedback-submit-btn">{t('feedback.submit')}
                </button>
            </div>
            <br/><br/>
        </>
    )
}