import "./createPackage.css"
import Navbar from "./Navbar.jsx";
import {useState} from "react";
import {auth, db, storage} from "./firebase.js";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage"
import {onAuthStateChanged} from "firebase/auth";
import {useNavigate} from "react-router-dom";
import {doc, getDoc, setDoc} from "firebase/firestore";

export default function CreatePackage() {
    const [pkgUpload, setPkgUpload] = useState(null);

    const [imgUpload0ne, setImgUploadOne] = useState(null);

    const [imgUploadTwo, setImgUploadTwo] = useState(null);

    const [imgUploadThree, setImgUploadThree] = useState(null);

    const [imgUploadFour, setImgUploadFour] = useState(null);

    const [banner, setBanner] = useState(null);

    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [version, setVersion] = useState("");
    const [username, setUsername] = useState("");

    let uid = "";
    const navigate = useNavigate()
    onAuthStateChanged(auth, (user) => {
        if (user) {
            uid = user.uid;
        } else {
            navigate("/")
        }
    });
    const upload = async () => {
        let extension = pkgUpload.type.replace(/(.*)\//g, '')
        let pkgRef = ref(storage, "users/" + uid + "/" + name + "/pkg/" + name + "." + extension)
        await uploadBytes(pkgRef, pkgUpload).then(() => {
            alert("pkg uploaded")
        });

        let bannerRef = ref(storage, "users/" + uid + "/" + name + "/img/" + banner.name)
        await uploadBytes(bannerRef, banner).then(() => {
            alert("banner uploaded")
        })

        let imgRefOne = ref(storage, "users/" + uid + "/" + name + "/img/" + (imgUpload0ne.name ?? ("screenone" + imgUpload0ne.type)))
        await uploadBytes(imgRefOne, imgUpload0ne).then(() => {
            alert("img uploaded")
        })

        let imgRefTwo = ref(storage, "users/" + uid + "/" + name + "/img/" + imgUploadTwo.name ?? ("screentwo" + imgUpload0ne.type))
        await uploadBytes(imgRefTwo, imgUploadTwo).then(() => {
            alert("img uploaded")

        })

        let imgRefThree = ref(storage, "users/" + uid + "/" + name + "/img/" + imgUploadThree.name ?? ("screenthree" + imgUpload0ne.type))
        await uploadBytes(imgRefThree, imgUploadThree).then(() => {
            alert("img uploaded")
        })

        let imgRefFour = ref(storage, "users/" + uid + "/" + name + "/img/" + imgUploadFour.name ?? ("screenfour" + imgUpload0ne.type))
        await uploadBytes(imgRefFour, imgUploadFour).then(() => {
            alert("img uploaded")
        })
        // get the username from the database using the uid
        const userRef = doc(db, "users", uid);
        await getDoc(userRef).then((doc) => {
            if (doc.exists()) {
                setUsername(doc.data().username)
            } else {
                console.log("No such document!");
            }
        });

        let bannerUrl = await getDownloadURL(bannerRef);
        console.log("uploaded banner")
        let screenOneUrl = await getDownloadURL(imgRefOne);
        console.log("uploaded screen one")
        let screenTwoUrl = await getDownloadURL(imgRefTwo);
        console.log("uploaded screen two")
        let screenThreeUrl = await getDownloadURL(imgRefThree);
        console.log("uploaded screen three")
        let screenFourUrl = await getDownloadURL(imgRefFour);
        console.log("uploaded screen four")
        let pkgUrl = await getDownloadURL(pkgRef).then(async (pkgUrl) => {
            await setDoc(doc(db, "packages", name), {
                name: name,
                description: desc,
                owner_id: uid,
                owner_username: username,
                current_version: version,
                downloads: 0,
                ratings: [],
                banner: bannerUrl,
                screenshots: [screenOneUrl, screenTwoUrl, screenThreeUrl, screenFourUrl],
                package: pkgUrl,
                sizeMb: pkgUpload.size / 1000000,
                created: new Date().getTime(),
            }).then(async r => {
                alert("Package created");
                // update user packages array with the new package
                const userRef = doc(db, "users", uid);
                await getDoc(userRef).then(async (doc) => {
                    if (doc.exists()) {
                        let packages = doc.data().owned_packages;
                        packages.push(name);
                        await setDoc(userRef, {
                            uid: uid,
                            username: doc.data().username,
                            plan: doc.data().plan,
                            owned_packages: packages,
                            owned_code_blocks: doc.data().owned_code_blocks,
                        }).then(r => {
                            alert("User updated");
                            navigate("/dashboard")
                        })
                    } else {
                        console.log("No such document!");
                    }
                })
            })
        })
    }
    return (
        <>
            <Navbar/>
            <h1 className="about-title">PUBLISH A PACKAGE</h1>
            <div className="centered">
                <h2 style={{margin: "0"}}>// GENERAL INFO</h2>
                <input type="text" className="name-input" placeholder="NAME" value={name}
                       onChange={e => setName(e.target.value)}/>
                <input type="text" className="desc-input" placeholder="DESCRIPTION" style={{marginBottom: "10px"}} value={desc}
                       onChange={e => setDesc(e.target.value)}/>
                <input type="file" id="banner-file" style={{display: "none"}} onChange={(event) => {
                    setBanner(event.target.files[0])
                    console.log("banner")
                }} accept=".jpeg,.webp, image/jpeg" required/>
                <label htmlFor="banner-file" className="file-input">UPLOAD BANNER</label>

                <h2 style={{margin: "0", marginTop: "40px", marginBottom: "10px"}}>// PACKAGE</h2>
                <input type="file" id="file" style={{display: "none"}} onChange={(event) => {
                    setPkgUpload(event.target.files[0])
                    console.log("pkg")
                }} accept=".zip, application/zip" required/>
                <label htmlFor="file" className="file-input">UPLOAD PACKAGE</label>
                <input type="text" className="desc-input" placeholder="PACKAGE VERSION" style={{marginTop: "10px"}} value={version}
                       onChange={e => setVersion(e.target.value)}/>


                <h2 style={{margin: "0", marginTop: "25px", marginBottom: "-10px"}}>// GALLERY IMAGES (MAX{'=>'}4)</h2>
                <input type="file" id="img-file" style={{display: "none"}} multiple onChange={(event) => {
                    setImgUploadOne(event.target.files[0])
                    setImgUploadTwo(event.target.files[1])
                    setImgUploadThree(event.target.files[2])
                    setImgUploadFour(event.target.files[3])
                    console.log("img")
                }} required accept=".jpeg,.webp, image/jpeg"/>
                <p>IDEAL DIMENSIONS: 890 x 460</p>
                <label htmlFor="img-file" className="file-input">UPLOAD IMAGES</label>
                <br/><br/>
                <button onClick={() => {
                    if (name === "") {
                        alert("Invalid name")
                    } else if (pkgUpload == null) {
                        alert("Please select a file.")
                    } else {
                        upload().then(r => {
                            navigate("/packages/" + name)
                        })
                    }
                }} className="publish-btn">
                </button>
            </div>
        </>
    )
}