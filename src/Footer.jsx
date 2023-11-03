import "./Footer.css"
import {Link} from "react-router-dom";
import data from "./Footer.json"
import i18n from "i18next";
import {useTranslation} from "react-i18next";

export default function Footer() {
    i18n.addResourceBundle("en", "footer", data.en)
    i18n.addResourceBundle("fr", "footer", data.fr)
    const {t} = useTranslation("footer");

    return (
        <div className="footer" id="footer">
            <div className="footer-sep"></div>
            <p>
                © 2023 DEVSHOP | <Link to="/about" className="footer-about-link">{t('footer.about')}</Link> <span
                className="footer-about-sep"></span> <span className="footer-lang footer-lang-active" id="footer-en"
                                                           onClick={() => {
                                                               if (!document.getElementById("footer-en").classList.contains("footer-lang-active")) {
                                                                   i18n.changeLanguage("en")
                                                                   document.getElementById("footer-fr").classList.remove("footer-lang-active")
                                                                   document.getElementById("footer-en").classList.add("footer-lang-active")
                                                               }
                                                           }}>ENGLISH</span> / <span className="footer-lang"
                                                                                     id="footer-fr" onClick={() => {
                if (!document.getElementById("footer-fr").classList.contains("footer-lang-active")) {
                    i18n.changeLanguage("fr")
                    document.getElementById("footer-en").classList.remove("footer-lang-active")
                    document.getElementById("footer-fr").classList.add("footer-lang-active")
                }
            }}>FRANÇAIS</span>
                <br/>horace.hoff@gmail.com
            </p>
        </div>
    )
}