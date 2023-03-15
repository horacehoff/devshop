import "./createPackage.css"
import Navbar from "./Navbar.jsx";
import {useState} from "react";
import {auth, storage} from "./firebase.js";
import {ref, uploadBytes} from "firebase/storage"
import {onAuthStateChanged} from "firebase/auth";
import {useNavigate} from "react-router-dom";

export default function CreatePackage() {
    const [pkgUpload, setPkgUpload] = useState(null);
    const [name, setName] = useState("");
    const {uid, setUid} = useState(null);
    const navigate = useNavigate()
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("yes")
            setUid(user.uid)

        } else {
            console.log("no")

            navigate("/")
        }
    });
    const uploadPkg = () => {
        if (pkgUpload != null) {
            const pkgRef = ref(storage, uid + name + "/pkg/" + pkgUpload.name)
            uploadBytes(pkgRef, pkgUpload).then(() => {
                alert("img uploaded")
            });


        }
    };
    return (
        <>
            <Navbar/>
            <h1 className="about-title">PUBLISH A PACKAGE</h1>
            <div className="centered">
                <h2 style={{margin: "0"}}>// REQUIRED</h2>
                <input type="text" className="name-input" placeholder="NAME" value={name}
                       onChange={e => setName(e.target.value)}/>
                <input type="text" className="desc-input" placeholder="DESCRIPTION" style={{marginBottom: "10px"}}/>
                <input type="text" className="img-input" placeholder="BANNER IMAGE URL"/>

                <h2 style={{margin: "0", marginTop: "25px", marginBottom: "10px"}}>// PACKAGE</h2>
                <input type="file" id="file" style={{display: "none"}} onChange={(event) => {
                    setPkgUpload(event.target.files[0])
                }}/>
                <label htmlFor="file" className="file-input">UPLOAD PACKAGE</label>
                <input type="text" className="desc-input" placeholder="PACKAGE VERSION" style={{marginTop: "10px"}}/>


                <h2 style={{margin: "0", marginTop: "25px"}}>// GALLERY IMAGES</h2>
                <input type="text" className="img-input" placeholder="1ST IMAGE URL"/>
                <input type="text" className="img-input" placeholder="2ND IMAGE URL"/>
                <input type="text" className="img-input" placeholder="3RD IMAGE URL"/>
                <input type="text" className="img-input" placeholder="4TH IMAGE URL"/>
                <input type="text" className="img-input" placeholder="5TH IMAGE URL"/>

                <button>Publish my package!</button>
            </div>
        </>
    )
}