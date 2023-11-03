import "./about.css";
import {Helmet} from "react-helmet";
import {useTranslation} from "react-i18next";
import data from "./about.json"
import i18n from "i18next";



export default function About() {
    i18n.addResourceBundle("en", "about", data.en)
    i18n.addResourceBundle("fr", "about", data.fr)
    const {t} = useTranslation("about");

    return (
        <>
            <Helmet>
                <meta
                    content="Learn about DEVSHOP"
                    name="description"/>
                <meta content="About" name="title"/>


                <meta content="https://dev-shop.vercel.app/about" property="twitter:url"/>
                <meta content="About" property="twitter:title"/>
                <meta content="Learn about DEVSHOP"
                      property="twitter:description"/>


                <meta content="https://dev-shop.vercel.app/about" property="og:url"/>
                <meta content="About" property="og:title"/>
                <meta content="Learn about DEVSHOP"
                      property="og:description"/>
            </Helmet>
            <img src="/banner.png" loading="lazy" className="about-banner"/>
            <p className="about-desc"><strong>DEVSHOP</strong>, {t('about.devshop_initial_name')}
                <span className="about-linktree"
                      onClick={() => window.open("https://linktr.ee/just_a_mango", '_blank').focus()}> @JUST_A_MANGO</span> (horace.hoff@gmail.com),
                {t('about.devshop_dev_begin')}</p>
            <br/>
            <h3 className="about-credits">{t('about.credits')}</h3>
            <ul className="about-credits-list">
                <li>
                    <span>❤</span>️ {t('about.credits.jetbrains1')} <br/>{t('about.credits.jetbrains2')} <strong><a
                    href="https://www.jetbrains.com/lp/mono">JetBrains Mono</a></strong>
                </li>
                <li>---</li>
                <li>
                    <span>❤</span>️ {t('about.credits.adobe1')} <br/>{t('about.credits.adobe2')} <strong><a
                    href="https://github.com/adobe-fonts/source-code-pro">Source Code Pro</a></strong>
                </li>
                <li>---</li>
                <li>
                    <span>🫶</span> ️{t('about.credits.thanks')}:<br/>
                    <ul>
                        <li>
                            uiwjs/wcjiang - <a
                            href="https://www.npmjs.com/package/@uiw/react-md-editor">@uiw/react-md-editor</a>
                        </li>
                        <li>
                            carakuei/cwelch5/djwiebe/<br/>miblanchard-nfl/mikenfl - <a
                            href="https://www.npmjs.com/package/@uiw/react-md-editor">react-helmet</a>
                        </li>
                        <li>
                            nwwells/tusbar/gorangajic/<br/>kamijin_fanta/nolanleung - <a
                            href="https://www.npmjs.com/package/react-icons">react-icons</a>
                        </li>
                        <li>
                            yjose - <a href="https://www.npmjs.com/package/reactjs-popup">reactjs-popup</a>
                        </li>
                        <li>
                            cfj - <a href="https://www.npmjs.com/package/short-number">short-number</a>
                        </li>
                    </ul>
                </li>
            </ul>
        </>
    )
}