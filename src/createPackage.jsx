import "./createPackage.css"
import {useState} from "react";
import {auth, db, storage, user_data} from "./firebase.js";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage"
import {onAuthStateChanged} from "firebase/auth";
import {useNavigate} from "react-router-dom";
import {doc, getDoc, setDoc} from "firebase/firestore";
import fancy_name_to_id, {generateUUID, interests_data, profanityFilter} from "./utility.js";
import MDEditor from '@uiw/react-md-editor';
import {BiCloudUpload} from "react-icons/bi";
import PackageCard from "./packageCard.jsx";
import Popup from "reactjs-popup";
import "./modal.css"

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
    let pkg_id = "";

    const [warning, setWarning] = useState(false);
    const [missingFields, setMissingFields] = useState(false);
    const [missingUploads, setMissingUploads] = useState(false);

    let uid = "";
    const navigate = useNavigate()
    onAuthStateChanged(auth, (user) => {
        if (user) {
            uid = user.uid;
        } else {
            setWarning(true)
        }
    });
    const upload = async () => {
        let name_id = generateUUID(fancy_name_to_id(name))
        pkg_id = name_id;
        let extension = pkgUpload.type.replace(/(.*)\//g, '')
        let pkgRef = ref(storage, "users/" + uid + "/packages/" + name_id + "/pkg/" + fancy_name_to_id(name) + "." + extension)
        await uploadBytes(pkgRef, pkgUpload).then(() => {
            document.getElementById("publish-btn").innerHTML = "UPLOADING => █▒▒▒▒▒▒▒▒▒▒▒▒▒ 7%"
        });

        let bannerRef = ref(storage, "users/" + uid + "/packages/" + name_id + "/img/banner/" + banner.name)
        await uploadBytes(bannerRef, banner).then(() => {
            document.getElementById("publish-btn").innerHTML = "UPLOADING => ██▒▒▒▒▒▒▒▒▒▒▒▒ 14%"
        })

        let imgRefOne = ref(storage, "users/" + uid + "/packages/" + name_id + "/img/one/" + (imgUpload0ne.name ?? ("screenone" + imgUpload0ne.type)))
        await uploadBytes(imgRefOne, imgUpload0ne).then(() => {
            document.getElementById("publish-btn").innerHTML = "UPLOADING => ███▒▒▒▒▒▒▒▒▒▒▒ 21%"
        })

        let imgRefTwo = ref(storage, "users/" + uid + "/packages/" + name_id + "/img/two/" + imgUploadTwo.name ?? ("screentwo" + imgUpload0ne.type))
        await uploadBytes(imgRefTwo, imgUploadTwo).then(() => {
            document.getElementById("publish-btn").innerHTML = "UPLOADING => ████▒▒▒▒▒▒▒▒▒▒ 28%"
        })

        let imgRefThree = ref(storage, "users/" + uid + "/packages/" + name_id + "/img/three/" + imgUploadThree.name ?? ("screenthree" + imgUpload0ne.type))
        await uploadBytes(imgRefThree, imgUploadThree).then(() => {
            document.getElementById("publish-btn").innerHTML = "UPLOADING => █████▒▒▒▒▒▒▒▒▒ 35%"
        })

        let imgRefFour = ref(storage, "users/" + uid + "/packages/" + name_id + "/img/four/" + imgUploadFour.name ?? ("screenfour" + imgUpload0ne.type))
        await uploadBytes(imgRefFour, imgUploadFour).then(() => {
            document.getElementById("publish-btn").innerHTML = "UPLOADING => ██████▒▒▒▒▒▒▒▒ 42%"
        })

        let bannerUrl = await getDownloadURL(bannerRef);
        console.log("uploaded banner")
        document.getElementById("publish-btn").innerHTML = "UPLOADING => ███████▒▒▒▒▒▒▒ 49%"
        let screenOneUrl = await getDownloadURL(imgRefOne);
        console.log("uploaded screen one")
        document.getElementById("publish-btn").innerHTML = "UPLOADING => ████████▒▒▒▒▒▒ 56%"
        let screenTwoUrl = await getDownloadURL(imgRefTwo);
        console.log("uploaded screen two")
        document.getElementById("publish-btn").innerHTML = "UPLOADING => █████████▒▒▒▒▒ 63%"
        let screenThreeUrl = await getDownloadURL(imgRefThree);
        console.log("uploaded screen three")
        document.getElementById("publish-btn").innerHTML = "UPLOADING => ██████████▒▒▒▒ 70%"
        let screenFourUrl = await getDownloadURL(imgRefFour);
        console.log("uploaded screen four")
        document.getElementById("publish-btn").innerHTML = "UPLOADING => ███████████▒▒▒ 77%"


        let own_username = "";
        const userRef = doc(db, "users", uid);
        await getDoc(userRef).then((doc) => {
            if (doc.exists()) {
                own_username = doc.data().username;
                document.getElementById("publish-btn").innerHTML = "UPLOADING => ████████████▒▒ 84%"

            } else {
                console.log("No such document!");
            }
        });
        let final_interests = [];
        let interests = document.getElementsByClassName("interestpkg");
        for (let i = 0; i < interests.length; i++) {
            if (interests[i].classList.contains("interest-toggled")) {
                final_interests.push(interests[i].innerHTML);
            }
        }


        let pkgUrl = await getDownloadURL(pkgRef).then(async (pkgUrl) => {
            await setDoc(doc(db, "packages", name_id), {
                name: profanityFilter(name),
                description: profanityFilter(longDesc),
                catchphrase: profanityFilter(desc),
                owner_id: uid,
                owner_username: own_username,
                current_version: version,
                downloads: [],
                ratings: [],
                interests: final_interests,
                banner: bannerUrl,
                screenshots: [screenOneUrl, screenTwoUrl, screenThreeUrl, screenFourUrl],
                package: pkgUrl,
                sizeMb: pkgUpload.size / 1000000,
                created: new Date().getTime(),
                id: name_id
            }).then(async r => {
                document.getElementById("publish-btn").innerHTML = "UPLOADING => █████████████▒ 91%"
                // update user packages array with the new package
                const userRef = doc(db, "users", uid);
                await getDoc(userRef).then(async (doc) => {
                    if (doc.exists()) {
                        let packages = doc.data().owned_packages;
                        packages.push(name_id);
                        await setDoc(userRef, {
                            owned_packages: packages
                        }, {merge: true}).then(r => {
                            document.getElementById("publish-btn").innerHTML = "UPLOADING => ██████████████ 100%"
                            return name_id
                        })
                    } else {
                        console.log("No such document!");
                        return name_id
                    }
                })
            })
        })
    }

    const handleInterestClick = (index) => {
        if (document.getElementById("interest" + index).classList.contains("interest-toggled")) {
            document.getElementById("interest" + index).classList.remove("interest-toggled");
        } else {
            document.getElementById("interest" + index).classList.add("interest-toggled");
        }
    }

    const [bannerURL, setBannerURL] = useState("");

    return (
        <>
            <Popup modal open={warning} onClose={() => {
                navigate("/packages")
            }}><span>
                <h4>⚠️</h4>
                <p className="popup-signin-txt">You need to sign in to be able to publish packages.</p>
                <button className="secondary popup-signin-btn" onClick={() => navigate("/sign-in")}>SIGN_IN</button>
                {/*<button className="primary popup-back-btn" onClick={() => navigate("/packages")}>GO BACK</button>*/}
            </span></Popup>
            <Popup modal open={missingFields}><span>
                <h4>ERROR</h4>
                <p className="popup-signin-txt">You need to fill in the required fields.</p>
                <button className="secondary popup-signin-btn" onClick={() => setMissingFields(false)}>OK</button>
            </span></Popup>
            <Popup modal open={missingUploads}><span>
                <h4>ERROR</h4>
                <p className="popup-signin-txt">You need to upload the required files.</p>
                <button className="secondary popup-signin-btn" onClick={() => setMissingUploads(false)}>OK</button>
            </span></Popup>
            <div className="split">
                <div className="split-two" id="split-two">
                    <h1 className="about-title about-title-card">PUBLISH A PACKAGE</h1>
                    <div className="split-two-card">
                        <PackageCard dwnl={[]} author={user_data ? user_data.username : "placeholder"}
                                     name={name || "placeholder"}
                                     catchphrase={desc || "placeholder"} banner={bannerURL}/>
                    </div>
                </div>
                <div className="split-one">
                    <h1 className="about-title">PUBLISH A PACKAGE</h1>
                    <div className="centered">
                        <h2 style={{margin: "0", fontWeight: "400", fontSize: "18px"}}>// GENERAL INFO</h2>
                        <br/>
                        <label htmlFor="name-input" className="name-input-label">NAME</label><br/>
                        <label htmlFor="name-input" className="name-input-label-desc">A good, and preferably short name
                            for your package</label><br/>
                        <input type="text" className="proto-input" id="name-input" placeholder="@awesome_name"
                               value={name}
                               onChange={e => setName(e.target.value)}/>
                        <br/><br/>
                        <label htmlFor="catch-input" className="name-input-label">CATCHPHRASE</label><br/>
                        <label htmlFor="catch-input" className="name-input-label-desc">A quick, short, and concise
                            description for your package</label><br/>
                        <input type="text" className="proto-input" id="catch-input" placeholder="@awesome_catchphrase"
                               style={{marginBottom: "10px"}} value={desc} onChange={e => setDesc(e.target.value)}/>

                        <br/><br/>
                        <label className="name-input-label">DESCRIPTION</label><br/>
                        <label className="name-input-label-desc">A longer, more precise description for your
                            package</label><br/>
                        <div className="md-editor-container">
                            <MDEditor
                                value={longDesc}
                                onChange={setLongDesc}
                                height={350}
                                style={{borderRadius: "4px", border: "none", outline: "none"}}
                            />
                        </div>

                        <br/>
                        <label className="name-input-label">UPLOADS</label><br/>
                        <label className="name-input-label-desc">Upload the needed files for your package</label><br/>
                        <input type="file" id="banner-file" style={{display: "none"}} onChange={(event) => {
                            setBanner(event.target.files[0])
                            setBannerURL(URL.createObjectURL(event.target.files[0]))
                            document.getElementById("banner-upload").innerHTML = "✅ UPLOAD BANNER"
                        }} accept=".jpeg,.webp, image/jpeg" required/>
                        <div className="upload-section">
                            <label htmlFor="banner-file" className="file-input" id="banner-upload"><BiCloudUpload
                                className="file-input-icon"></BiCloudUpload>UPLOAD BANNER</label>
                            <label htmlFor="file" className="file-input" id="file-upload"><BiCloudUpload
                                className="file-input-icon"></BiCloudUpload>UPLOAD PACKAGE</label>
                            <label htmlFor="img-file" className="file-input" id="gallery-upload"><BiCloudUpload
                                className="file-input-icon"></BiCloudUpload>UPLOAD IMAGES(4)</label>
                            <br/>
                        </div>
                        <br/><br/>
                        <label className="name-input-label" htmlFor="pkg-version">BASE VERSION</label><br/>
                        <label className="name-input-label-desc" htmlFor="pkg-version">The base version of your package
                            (e.g. 1.0, ALPHA, 1.0.0A)</label><br/>
                        <input type="text" className="proto-input" id="pkg-version" placeholder="@base_pkg_version"
                               style={{marginTop: "0px"}} value={version}
                               onChange={e => setVersion(e.target.value)}/>
                        <br/>
                        <input type="file" id="file" style={{display: "none"}} onChange={(event) => {
                            setPkgUpload(event.target.files[0])
                            console.log("pkg")
                            document.getElementById("file-upload").innerHTML = "✅ UPLOAD PACKAGE"
                        }} accept=".zip, application/zip" required/>


                        <input type="file" id="img-file" style={{display: "none"}} multiple onChange={(event) => {
                            console.log(event.target.files[0])
                            setImgUploadOne(event.target.files[0])
                            setImgUploadTwo(event.target.files[1])
                            setImgUploadThree(event.target.files[2])
                            setImgUploadFour(event.target.files[3])
                            console.log("img")
                            if (event.target.files.length === 4) {
                                document.getElementById("gallery-upload").innerHTML = "✅ UPLOAD IMAGES(4)"
                            }
                        }} required accept=".png,.jpeg,.webp, image/jpeg, image/png"/>
                        <br/><br/>
                        <p className="create-package-interest-data">// CATEGORIES</p>
                        <div className="create-package-interest-div">
                            {
                                interests_data.map((interest, index) => {
                                    return (
                                        <div className="interestpkg" id={"interest" + index} onClick={() => {
                                            handleInterestClick(index);
                                        }}>
                                            {interest}
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <br/>
                        <button onMouseEnter={() => {
                            if (document.getElementById("publish-btn").style.pointerEvents !== "none") {
                                document.getElementById("publish-btn").innerHTML = ">> PUBLISH PACKAGE <<"
                            }
                        }} onMouseLeave={() => {
                            if (document.getElementById("publish-btn").style.pointerEvents !== "none") {
                                document.getElementById("publish-btn").innerHTML = "PUBLISH PACKAGE"
                            }
                        }} onClick={() => {
                            if (name === "" || desc === "" || version === "" || longDesc === "" || !/\S/.test(name) || !/\S/.test(desc) || !/\S/.test(version) || !/\S/.test(longDesc)) {
                                setMissingFields(true)
                            } else if (!pkgUpload || !imgUpload0ne || !imgUploadTwo || !imgUploadThree || !imgUploadFour || !banner) {
                                setMissingUploads(true)
                            } else {
                                document.getElementById("publish-btn").style.pointerEvents = "none"
                                document.getElementById("publish-btn").innerHTML = "UPLOADING => ▒▒▒▒▒▒▒▒▒▒▒▒▒▒ 0%"
                                upload().then(name_id => {
                                    navigate("/packages/" + pkg_id)
                                    window.location.reload()
                                })
                            }
                        }} className="primary publish-btn" id="publish-btn">
                            PUBLISH PACKAGE
                        </button>
                    </div>
                    <br/>
                </div>
            </div>


        </>
    )
}