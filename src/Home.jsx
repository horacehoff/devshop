import "./Home.css"
import Navbar from "./Navbar.jsx";

export default function Home() {
    return (
        <>
        <Navbar/>
        <br/>
        <h1 className="buy-code-sell">BUY.<br/>CODE.<br/>SELL.</h1>
        <p className="one-catchphrase">// 01 - CATCHPHRASE</p>
        <p className="one-desc">{"Devshop allows anyone to buy, use, or sell code. Wether it be full programs (called <<packages>>) or code snippets (called <<code blocks>>), DEVSHOP has it all."}</p>

        </>
    )
}