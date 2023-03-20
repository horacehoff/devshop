import "./createPackage.css"
import Navbar from "./Navbar.jsx";
import {useState} from "react";
import {auth, storage} from "./firebase.js";
import {ref, uploadBytes} from "firebase/storage"
import {onAuthStateChanged} from "firebase/auth";
import {useNavigate} from "react-router-dom";

export default function CreatePackage() {
    const [pkgUpload, setPkgUpload] = useState(null);
    const [imgUploadOne, setImgUploadOne] = useState(null);
    const [imgUploadTwo, setImgUploadTwo] = useState(null);
    const [imgUploadThree, setImgUploadThree] = useState(null);
    const [imgUploadFour, setImgUploadFour] = useState(null);
    const [name, setName] = useState("");
    let uid = "";
    const navigate = useNavigate()
    onAuthStateChanged(auth, (user) => {
        if (user) {
            uid = user.uid;
        } else {
            navigate("/")
        }
    });
    const uploadPkg = () => {
        const pkgRef = ref(storage, "users/" + uid + "/" + name + "/pkg/" + pkgUpload.name)
        uploadBytes(pkgRef, pkgUpload).then(() => {
            alert("pkg uploaded")
        });
    };
    const uploadImg = () => {
        const imgRefOne = ref(storage, "users/" + uid + "/" + name + "/img/" + imgUploadOne.name)
        uploadBytes(imgRefOne, imgUploadOne).then(() => {
            alert("img uploaded")
        });
        // const imgRefTwo = ref(storage, "users/" + uid + "/" + name + "/img/" + imgUploadTwo.name)
        // uploadBytes(imgRefTwo, imgUploadTwo).then(() => {
        //     alert("img uploaded")
        // });
        // const imgRefThree = ref(storage, "users/" + uid + "/" + name + "/img/" + imgUploadThree.name)
        // uploadBytes(imgRefThree, imgUploadThree).then(() => {
        //     alert("img uploaded")
        // });
        // const imgRefFour = ref(storage, "users/" + uid + "/" + name + "/img/" + imgUploadFour.name)
        // uploadBytes(imgRefFour, imgUploadFour).then(() => {
        //     alert("img uploaded")
        // });
    }
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


                <h2 style={{margin: "0", marginTop: "25px", marginBottom: "-10px"}}>// GALLERY IMAGES (MAX{'=>'}4)</h2>
                <input type="file" id="file" multiple onChange={(event) => {
                    imgUpload.push(event.target.files[0])
                }}/>
                <p>IDEAL DIMENSIONS: 890 x 460</p>
                <label htmlFor="file" className="file-input">UPLOAD IMAGES</label>
                <br/><br/>
                <button onClick={() => {
                    if (name === "") {
                        alert("Invalid name")
                    } else if (pkgUpload == null) {
                        alert("Please select a file.")
                    } else {
                        uploadImg()
                        uploadPkg()
                    }
                }}>Publish my package!
                </button>
            </div>
        </>
    )
}