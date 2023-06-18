import "./about.css";
import Navbar from "./Navbar.jsx";

export default function About() {
    return (
        <>
            <Navbar/>
            <h2 className="about-title">ABOUT ‘DEVSHOP’</h2>
            <p className="about-subtitle">BY <span className="about-linktree"
                                                   onClick={() => window.open("https://linktr.ee/just_a_mango", '_blank').focus()}>@JUST_A_MANGO</span>
            </p>
            <p className="about-subtitle" style={{marginTop: "15px"}}>DEVELOPMENT STARTED IN FEBRUARY 2023</p>
        </>
    )
}