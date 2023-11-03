import "./Home.css"
import Footer from "./Footer.jsx";
import i18n from "i18next";
import data from "./Home.json";
import {useTranslation} from "react-i18next";


export default function Home() {
    i18n.addResourceBundle("en", "home", data.en)
    i18n.addResourceBundle("fr", "home", data.fr)
    const {t} = useTranslation("home");


    return (
        <>
            <h1 className="buy-code-sell">{t('home.code')}.<br/>{t('home.buy')}.<br/>{t('home.sell')}.</h1>
            <p className="one-catchphrase">{t('home.catchphrase_title')}</p>
            <p className="one-desc">{t('home.catchphrase')}</p>
            <p className="one-catchphrase">{t('home.why_title')}</p>
            <p className="one-desc"></p>
            <ul className="one-desc">
                <li>{t('home.why1')}</li>
                {/*<li>DEVSHOP is free to use (except if you want to remove ads)</li>*/}
                {/*<li>DEVSHOP charges a commission of 10% only per sale</li>*/}
                <li>{t('home.why2')}</li>
                <li>{t('home.why3')}</li>
            </ul>
        </>
    )
}