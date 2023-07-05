import "./packages.css"
import "./codeBlocks.css"
import Navbar from "./Navbar.jsx";
import CodeCard from "./codeCard.jsx";
import {Link} from "react-router-dom";
import {IoMdSearch} from "react-icons/all.js";

export default function CodeBlocks() {
    return (
        <>
            <Navbar/>
            <h1 className="packages-title code-blocks-title">CODE<br/>BLOCKS</h1>
            <Link className="package-publish-btn" id="package-publish-btn"
                  to="/publish-package">+ PUBLISH A PACKAGE
            </Link>
            <Link className="package-publish-btn" id="package-search-btn"
                  style={{marginLeft: "10px", maxWidth: "150px"}}
                  to="/search-packages"><IoMdSearch
                style={{position: "relative", top: "1px"}}/> SEARCH PACKAGES
            </Link>
            <h2 className="category-title">// CURRENTLY TRENDING</h2>
            <ul className="packages-card-list">
                <li><CodeCard dwnl="55566564" name="Pi number calculator" author="hombrewTeam"
                              description='An algorithm capable of calculating the remaining numbers of the famous mathematics symbol known as Pi, whose value is about 3.14.'/>
                </li>
            </ul>
        </>
    )
}