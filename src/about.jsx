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
        </>
    )
}