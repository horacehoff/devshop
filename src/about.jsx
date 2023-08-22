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
            <h2 className="about-ttl">ABOUT ‘DEVSHOP’</h2>
            <p className="about-subtitle">BY <span className="about-linktree"
                                                   onClick={() => window.open("https://linktr.ee/just_a_mango", '_blank').focus()}>@JUST_A_MANGO</span>
            </p>
            <p className="about-subtitle" style={{marginTop: "15px"}}>DEVELOPMENT STARTED IN FEBRUARY 2023</p>
        </>
    )
}