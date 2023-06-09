import "./createPackage.css"
import Navbar from "./Navbar.jsx";
import {useState} from "react";
import {auth, db, storage} from "./firebase.js";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage"
import {onAuthStateChanged} from "firebase/auth";
import {useNavigate} from "react-router-dom";
import {doc, getDoc, setDoc} from "firebase/firestore";
import fancy_name_to_id from "./utility.js";
import MDEditor from '@uiw/react-md-editor';
import {BiCloudUpload} from "react-icons/all.js";

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
    const [longDesc, setLongDesc] = useState("**This is the detailed description of my awesome package!**");

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
        let pkgRef = ref(storage, "users/" + uid + "/" + fancy_name_to_id(name) + "/pkg/" + fancy_name_to_id(name) + "." + extension)
        await uploadBytes(pkgRef, pkgUpload).then(() => {
            document.getElementById("publish-btn").innerHTML = "UPLOADING... => █▒▒▒▒▒▒▒▒▒▒▒▒▒ 7%"
        });

        let bannerRef = ref(storage, "users/" + uid + "/" + fancy_name_to_id(name) + "/img/banner/" + banner.name)
        await uploadBytes(bannerRef, banner).then(() => {
            document.getElementById("publish-btn").innerHTML = "UPLOADING... => ██▒▒▒▒▒▒▒▒▒▒▒▒ 14%"
        })

        let imgRefOne = ref(storage, "users/" + uid + "/" + fancy_name_to_id(name) + "/img/one/" + (imgUpload0ne.name ?? ("screenone" + imgUpload0ne.type)))
        await uploadBytes(imgRefOne, imgUpload0ne).then(() => {
            document.getElementById("publish-btn").innerHTML = "UPLOADING... => ███▒▒▒▒▒▒▒▒▒▒▒ 21%"
        })

        let imgRefTwo = ref(storage, "users/" + uid + "/" + fancy_name_to_id(name) + "/img/two/" + imgUploadTwo.name ?? ("screentwo" + imgUpload0ne.type))
        await uploadBytes(imgRefTwo, imgUploadTwo).then(() => {
            document.getElementById("publish-btn").innerHTML = "UPLOADING... => ████▒▒▒▒▒▒▒▒▒▒ 28%"
        })

        let imgRefThree = ref(storage, "users/" + uid + "/" + fancy_name_to_id(name) + "/img/three/" + imgUploadThree.name ?? ("screenthree" + imgUpload0ne.type))
        await uploadBytes(imgRefThree, imgUploadThree).then(() => {
            document.getElementById("publish-btn").innerHTML = "UPLOADING... => █████▒▒▒▒▒▒▒▒▒ 35%"
        })

        let imgRefFour = ref(storage, "users/" + uid + "/" + fancy_name_to_id(name) + "/img/four/" + imgUploadFour.name ?? ("screenfour" + imgUpload0ne.type))
        await uploadBytes(imgRefFour, imgUploadFour).then(() => {
            document.getElementById("publish-btn").innerHTML = "UPLOADING... => ██████▒▒▒▒▒▒▒▒ 42%"
        })

        let bannerUrl = await getDownloadURL(bannerRef);
        console.log("uploaded banner")
        document.getElementById("publish-btn").innerHTML = "UPLOADING... => ███████▒▒▒▒▒▒▒ 49%"
        let screenOneUrl = await getDownloadURL(imgRefOne);
        console.log("uploaded screen one")
        document.getElementById("publish-btn").innerHTML = "UPLOADING... => ████████▒▒▒▒▒▒ 56%"
        let screenTwoUrl = await getDownloadURL(imgRefTwo);
        console.log("uploaded screen two")
        document.getElementById("publish-btn").innerHTML = "UPLOADING... => █████████▒▒▒▒▒ 63%"
        let screenThreeUrl = await getDownloadURL(imgRefThree);
        console.log("uploaded screen three")
        document.getElementById("publish-btn").innerHTML = "UPLOADING... => ██████████▒▒▒▒ 70%"
        let screenFourUrl = await getDownloadURL(imgRefFour);
        console.log("uploaded screen four")
        document.getElementById("publish-btn").innerHTML = "UPLOADING... => ███████████▒▒▒ 77%"


        let own_username = "";
        const userRef = doc(db, "users", uid);
        await getDoc(userRef).then((doc) => {
            if (doc.exists()) {
                own_username = doc.data().username;
                document.getElementById("publish-btn").innerHTML = "UPLOADING... => ████████████▒▒ 84%"

            } else {
                console.log("No such document!");
            }
        });


        let pkgUrl = await getDownloadURL(pkgRef).then(async (pkgUrl) => {
            await setDoc(doc(db, "packages", fancy_name_to_id(name)), {
                name: name,
                description: longDesc,
                catchphrase: desc,
                owner_id: uid,
                owner_username: own_username,
                current_version: version,
                downloads: 0,
                ratings: [],
                banner: bannerUrl,
                screenshots: [screenOneUrl, screenTwoUrl, screenThreeUrl, screenFourUrl],
                package: pkgUrl,
                sizeMb: pkgUpload.size / 1000000,
                created: new Date().getTime(),
            }).then(async r => {
                document.getElementById("publish-btn").innerHTML = "UPLOADING... => █████████████▒ 91%"
                // update user packages array with the new package
                const userRef = doc(db, "users", uid);
                await getDoc(userRef).then(async (doc) => {
                    if (doc.exists()) {
                        let packages = doc.data().owned_packages;
                        packages.push(fancy_name_to_id(name));
                        await setDoc(userRef, {
                            uid: uid,
                            username: doc.data().username,
                            plan: doc.data().plan,
                            owned_packages: packages,
                            owned_code_blocks: doc.data().owned_code_blocks,
                        }).then(r => {
                            document.getElementById("publish-btn").innerHTML = "UPLOADING... => ██████████████ 100%"
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
                <h2 style={{margin: "0", fontWeight: "400", fontSize: "18px"}}>// GENERAL INFO</h2>
                <input type="text" className="name-input" placeholder="NAME" value={name}
                       onChange={e => setName(e.target.value)}/>
                <input type="text" className="desc-input" placeholder="CATCHPHRASE"
                       style={{marginBottom: "10px"}} value={desc} onChange={e => setDesc(e.target.value)}/>

                <div className="md-editor-container">
                    <MDEditor
                        value={longDesc}
                        onChange={setLongDesc}
                        height={350}
                        style={{borderRadius: "4px", border: "none", outline: "none"}}
                    />
                </div>


                <input type="file" id="banner-file" style={{display: "none"}} onChange={(event) => {
                    setBanner(event.target.files[0])
                    console.log("banner")
                }} accept=".jpeg,.webp, image/jpeg" required/>
                <div className="upload-section">
                    <label htmlFor="banner-file" className="file-input"><BiCloudUpload
                        className="file-input-icon"></BiCloudUpload>UPLOAD BANNER</label>
                    <label htmlFor="file" className="file-input"><BiCloudUpload
                        className="file-input-icon"></BiCloudUpload>UPLOAD PACKAGE</label>
                    <label htmlFor="img-file" className="file-input"><BiCloudUpload
                        className="file-input-icon"></BiCloudUpload>UPLOAD IMAGES(4)</label>
                    <br/>
                    <input type="text" className="desc-input" placeholder="PACKAGE VERSION"
                           style={{marginTop: "20px", marginBottom: "30px", fontSize: "20px"}} value={version}
                           onChange={e => setVersion(e.target.value)}/>
                </div>

                {/*<h2 style={{margin: "0", marginTop: "40px", marginBottom: "0"}}>// PACKAGE</h2>*/}

                <input type="file" id="file" style={{display: "none"}} onChange={(event) => {
                    setPkgUpload(event.target.files[0])
                    console.log("pkg")
                }} accept=".zip, application/zip" required/>


                {/*<h2 style={{margin: "0", marginTop: "25px", marginBottom: "-10px"}}>// GALLERY IMAGES (MAX{'=>'}4)</h2>*/}
                <input type="file" id="img-file" style={{display: "none"}} multiple onChange={(event) => {
                    console.log(event.target.files[0])
                    setImgUploadOne(event.target.files[0])
                    setImgUploadTwo(event.target.files[1])
                    setImgUploadThree(event.target.files[2])
                    setImgUploadFour(event.target.files[3])
                    console.log("img")
                }} required accept=".png,.jpeg,.webp, image/jpeg, image/png"/>
                {/*<p>IDEAL DIMENSIONS: 890 x 460</p>*/}

                <button onMouseEnter={() => {
                    if (document.getElementById("publish-btn").style.pointerEvents !== "none") {
                        document.getElementById("publish-btn").innerHTML = ">> PUBLISH PACKAGE <<"
                    }
                }} onMouseLeave={() => {
                    if (document.getElementById("publish-btn").style.pointerEvents !== "none") {
                        document.getElementById("publish-btn").innerHTML = "PUBLISH PACKAGE"
                    }
                }} onClick={() => {
                    if (name === "") {
                        alert("Invalid name")
                    } else if (pkgUpload == null) {
                        alert("Please select a file.")
                    } else {
                        document.getElementById("publish-btn").style.pointerEvents = "none"
                        document.getElementById("publish-btn").innerHTML = "UPLOADING... => ▒▒▒▒▒▒▒▒▒▒▒▒▒▒ 0%"
                        upload().then(r => {
                            navigate("/packages/" + fancy_name_to_id(name))
                            window.location.reload()
                        })
                    }
                }} className="publish-btn" id="publish-btn">
                    PUBLISH PACKAGE
                </button>
            </div>
        </>
    )
}