import "./Home.css"
import Navbar from "./Navbar.jsx";
import PackageCard from "./packageCard.jsx";

export default function Home() {
    return (
        <>
            <Navbar/>
            <br/>
            <h1 className="buy-code-sell">CODE.<br/>BUY.<br/>SELL.</h1>
            <p className="one-catchphrase">// 01 - CATCHPHRASE</p>
            <p className="one-desc">{"DEVSHOP allows anyone to buy, use, or sell code. Wether it be full programs (called <<packages>>) or code snippets (called <<code blocks>>), DEVSHOP has it all."}</p>
            <PackageCard dwnl="55566564" author="hombrewTeam"
                         desc="Homebrew offers a wide variety of packages to download. Its available platforms are macOS and Linux, and Windows support is coming soon"/>
        </>
    )
}