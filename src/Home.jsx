import "./Home.css"
import Footer from "./Footer.jsx";


export default function Home() {
    return (
        <>
            {/*<br/>*/}
            <h1 className="buy-code-sell">CODE.<br/>BUY.<br/>SELL.</h1>
            <p className="one-catchphrase">// 01 - CATCHPHRASE</p>
            <p className="one-desc"
               style={{color: "white"}}>{"DEVSHOP allows anyone to buy, use, or sell code. Wether it be full programs/projects (called " + '"packages"' + ") or code snippets, DEVSHOP has it all."}</p>
            <p className="one-catchphrase">// 02 - WHY USE DEVSHOP ?</p>
            <p className="one-desc"></p>
            <ul className="one-desc">
                <li>DEVSHOP is, for now, free to use</li>
                {/*<li>DEVSHOP is free to use (except if you want to remove ads)</li>*/}
                {/*<li>DEVSHOP charges a commission of 10% only per sale</li>*/}
                <li>DEVSHOP is developer-friendly</li>
                <li>DEVSHOP will never sell your personal information</li>
            </ul>
            <Footer/>
        </>
    )
}