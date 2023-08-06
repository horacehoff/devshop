import "./Footer.css"
import {Link} from "react-router-dom";

export default function Footer() {
    return (
        <div className="footer" id="footer">
            <div className="footer-sep"></div>
            <p>
                © 2023 DEVSHOP | <Link to="/about" className="footer-about-link">ABOUT</Link> <span
                className="footer-about-sep"></span> horace.hoff@gmail.com
            </p>
        </div>
    )
}