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
                        <li>❌ Set categories for packages/snippets</li>
                    </ul>
                    {/*<button className="plan-sign-up" id="plan-sign-up" onClick={() => {*/}
                    {/*    navigate("/sign-up")*/}
                    {/*}}>Sign Up*/}
                    {/*</button>*/}
                </div>

                <div className="pro-plan">
                    <h1 className="plan-title pro-plan-title">PRO</h1>
                    <p className="plan-price pro-plan-price">1.99€/month</p>
                    <ul className="plan-features">
                        <li>✅ Full access to the website</li>
                        <li>✅ No ads</li>
                        <li>✅ Set categories for packages/snippets</li>
                    </ul>
                    {/*<button className="plan-subscribe" id="plan-subscribe">coming soon</button>*/}
                </div>
            </div>
            {/*<br/>*/}
            {/*<h3 className="pricing-exp-title">WHAT THIS MEANS</h3>*/}
            {/*<h4 className="pricing-exp-plan">With the BASIC plan, you get:</h4>*/}
            {/*<span className="pricing-exp-plan-characteristics">*/}
            {/*    <span className="pricing-exp-plan-characteristics-title">FULL ACCESS TO THE WEBSITE</span>, meaning you get access to all of the website's pages/sections, without limits nor restrictions, the website is yours to explore!*/}
            {/*</span>*/}
            {/*<br/><br/>*/}
            {/*<br/><br/>*/}
            {/*<h4 className="pricing-exp-plan">With the <span style={{color: "mediumpurple"}}>PRO</span> plan, you get:</h4>*/}
            {/*<span className="pricing-exp-plan-characteristics">*/}
            {/*    <span><span className="pricing-exp-plan-characteristics-title">FULL ACCESS TO THE WEBSITE</span>, meaning you get access to all of the website's pages/sections, without limits nor restrictions, the website is yours to explore!</span>*/}
            {/*    <br/><br/>*/}
            {/*    <span style={{position: "relative", marginTop: "10px"}}><span className="pricing-exp-plan-characteristics-title">NO ADS</span>, that is to say you'll never be annoyed by advertisements on the website, ever.</span>*/}
            {/*    <br/><br/>*/}
            {/*    <span style={{position: "relative", marginTop: "10px"}}><span className="pricing-exp-plan-characteristics-title">SET CATEGORIES FOR PACKAGES/SNIPPETS</span>, this means, for each package/snippet that you publish, you can set custom "categories" for each one of them, to better target your user base.</span>*/}
            {/*</span>*/}
            <Footer/>
        </>
    )
}