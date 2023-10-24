import "./about.css";
import {Helmet} from "react-helmet";

export default function About() {
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
            <p className="about-desc"><strong>DEVSHOP</strong>, initially called Publish My Package, was created
                By <span className="about-linktree"
                         onClick={() => window.open("https://linktr.ee/just_a_mango", '_blank').focus()}>@JUST_A_MANGO</span> (horace.hoff@gmail.com),
                with development starting in February 2023.</p>
            <br/>
            <h3 style={{textAlign: "center"}}>CREDITS</h3>
            <ul className="about-credits-list">
                <li>
                    <span style={{fontFamily: "Inter, sans-serif"}}>❤</span>️ Many thanks to <br/>JetBrains for their
                    awesome font <strong><a href="https://www.jetbrains.com/lp/mono">JetBrains Mono</a></strong>
                </li>
                <li>---</li>
                <li>
                    <span style={{fontFamily: "Inter, sans-serif"}}>❤</span>️ Much appreciation also to <br/>Adobe
                    for <strong><a href="https://github.com/adobe-fonts/source-code-pro">Source Code Pro</a></strong>
                </li>
                <li>---</li>
                <li>
                    <span style={{fontFamily: "Inter, sans-serif"}}>🫶</span> ️I would also like to thank the authors of
                    the following packages that DEVSHOP uses:<br/>
                    <ul style={{listStyleType: "'-'"}}>
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