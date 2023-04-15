import Navbar from "./Navbar.jsx";
import "./pricing.css"

export default function Pricing() {
    return (
        <>
            <Navbar/>
            <h1 className="pricing-title">PRICING</h1>
            <p className="pricing-subtitle">You can use DEVSHOP for free, or you can pay a small amount of money each
                month to get rid of all inconvenients and get the full experience</p>

            <div className="pricing-container">
                <div className="basic-plan">
                    <h1 className="plan-title">BASIC</h1>
                    <p className="plan-price">FREE</p>
                    <ul className="plan-features">
                        <li>Full access to the website</li>
                        <li>Ads</li>
                    </ul>
                    <button className="plan-sign-up">Sign Up</button>
                </div>

                <div className="pro-plan">
                    <h1 className="plan-title">PRO</h1>
                    <p className="plan-price" style={{color: "blanchedalmond"}}>1.99€/month</p>
                    <ul className="plan-features">
                        <li>Full access to the website</li>
                        <li>No ads</li>
                        <li><span style={{color: "mediumpurple"}}>Colored username</span></li>
                    </ul>
                    <button className="plan-subscribe">subscribe</button>
                </div>
            </div>
        </>
    )
}