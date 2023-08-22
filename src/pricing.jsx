import "./pricing.css"
import Footer from "./Footer.jsx";
import {Helmet} from "react-helmet";

export default function Pricing() {
    // const navigate = useNavigate()

    // useEffect(() => {
    //     if (document.getElementById("account").innerHTML === "ACCOUNT" || document.getElementById("nav-account").innerHTML === "ACCOUNT") {
    //         document.getElementById("plan-sign-up").innerHTML = "CURRENT"
    //     }
    // }, [])


    return (
        <>
            <Helmet>
                <meta
                    content="The soon-to-be pricing of DEVSHOP"
                    name="description"/>
                <meta content="Pricing" name="title"/>


                <meta content="https://dev-shop.vercel.app/pricing" property="twitter:url"/>
                <meta content="Pricing" property="twitter:title"/>
                <meta content="The soon-to-be pricing of DEVSHOP"
                      property="twitter:description"/>


                <meta content="https://dev-shop.vercel.app/pricing" property="og:url"/>
                <meta content="Pricing" property="og:title"/>
                <meta content="The soon-to-be pricing of DEVSHOP"
                      property="og:description"/>
            </Helmet>
            <h1 className="pricing-title">PRICING</h1>
            <h3 className="pricing-parentsubtitle">(COMING SOON; AS OF NOW THE WEBSITE IS 100% FREE TO USE)</h3>
            <p className="pricing-subtitle">You can use DEVSHOP for free, or you can pay a small amount of money each
                month to get rid of all inconvenients and get the full experience</p>

            <div className="pricing-container">
                <div className="basic-plan">
                    <h1 className="plan-title">BASIC</h1>
                    <p className="plan-price">FREE</p>
                    <ul className="plan-features">
                        <li>✅ Full access to the website</li>
                        <li>❌ Ads</li>
                    </ul>
                    {/*<button className="plan-sign-up" id="plan-sign-up" onClick={() => {*/}
                    {/*    navigate("/sign-up")*/}
                    {/*}}>Sign Up*/}
                    {/*</button>*/}
                </div>

                <div className="pro-plan">
                    <h1 className="plan-title" style={{color: "mediumpurple"}}>PRO</h1>
                    <p className="plan-price" style={{color: "blanchedalmond"}}>1.99€/month</p>
                    <ul className="plan-features">
                        <li>✅ Full access to the website</li>
                        <li>✅ No ads</li>
                    </ul>
                    {/*<button className="plan-subscribe" id="plan-subscribe">coming soon</button>*/}
                </div>
            </div>
            <Footer/>
        </>
    )
}