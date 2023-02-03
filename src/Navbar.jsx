import "./Navbar.css"

export default function Navbar() {
    return (
        <>
            <div className="nav">

                <h2>DEVSHOP</h2>
                <h4 id="code-blocks">CODE BLOCKS</h4>
                <h4 id="packages">PACKAGES</h4>
                <h4 id="pricing">PRICING</h4>
                <h4 id="about">ABOUT</h4>
                <h4 id="account">ACCOUNT</h4>
                <h4 id="hamburger" onClick={() => {
                    if (document.getElementById("hamburger").innerHTML === "||") {
                        document.getElementById("hamburger").innerHTML = "//"
                        document.getElementById("full-nav").style.left = "0"
                    } else {
                        document.getElementById("hamburger").innerHTML = "||"
                        document.getElementById("full-nav").style.left = "-100%"
                    }
                }}>||</h4>
                <div id="full-nav">
                    <ul>
                        <li>CODE BLOCKS</li>
                        <li>PACKAGES</li>
                        <li>PRICING</li>
                        <li>ABOUT</li>
                        <li>ACCOUNT</li>
                    </ul>
                </div>

            </div>
        </>
    )
}