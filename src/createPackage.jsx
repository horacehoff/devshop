import "./createPackage.css"
import Navbar from "./Navbar.jsx";

export default function CreatePackage() {
    return (
        <>
            <Navbar/>
            <h1 className="about-title">PUBLISH A PACKAGE</h1>
            <div className="centered">
                <h2 style={{margin: "0"}}>REQUIRED</h2>
                <input type="text" className="name-input" placeholder="NAME"/>
                <input type="text" className="desc-input" placeholder="DESCRIPTION"/>
                <input type="text" className="desc-input" placeholder="PACKAGE VERSION"/>
                <input type="text" className="img-input" placeholder="BANNER IMAGE URL"/>

                <h2 style={{margin: "0", marginTop: "25px"}}>GALLERY IMAGES</h2>
                <input type="text" className="img-input" placeholder="1ST IMAGE URL"/>
                <input type="text" className="img-input" placeholder="2ND IMAGE URL"/>
                <input type="text" className="img-input" placeholder="3RD IMAGE URL"/>
                <input type="text" className="img-input" placeholder="4TH IMAGE URL"/>
                <input type="text" className="img-input" placeholder="5TH IMAGE URL"/>

            </div>
        </>
    )
}