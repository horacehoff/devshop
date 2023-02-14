import "./packages.css"
import Navbar from "./Navbar.jsx";
import CodeCard from "./codeCard.jsx";

export default function CodeBlocks() {
    return (
        <>
            <Navbar/>
            <h1 className="packages-title">CODE<br/>BLOCKS</h1>
            <h2 className="category-title">// CURRENTLY TRENDING</h2>
            <ul className="packages-card-list">
                <li><CodeCard dwnl="55566564" author="hombrewTeam"
                              desc='print("hello world")'/>
                </li>
            </ul>
        </>
    )
}