import "./createPackage.css"
import "./createCodeBlock.css"
import Navbar from "./Navbar.jsx";
import {useState} from "react";
import {auth, db, storage} from "./firebase.js";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage"
import {onAuthStateChanged} from "firebase/auth";
import {useNavigate} from "react-router-dom";
import {doc, getDoc, setDoc} from "firebase/firestore";
import fancy_name_to_id, {generateUUID, interests_data, profanityFilter} from "./utility.js";
import MDEditor from '@uiw/react-md-editor';
import {BiCloudUpload} from "react-icons/bi";

export default function CreateCodeBlock() {
    const [pkgUpload, setPkgUpload] = useState(null);

    const [imgUpload0ne, setImgUploadOne] = useState(null);

    const [imgUploadTwo, setImgUploadTwo] = useState(null);

    const [imgUploadThree, setImgUploadThree] = useState(null);

    const [imgUploadFour, setImgUploadFour] = useState(null);

    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [version, setVersion] = useState("");
    const [longDesc, setLongDesc] = useState("**This is the detailed description of my awesome code block!**");
    const [code, setCode] = useState("");
    let codeblock_id = "";

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
        let name_id = generateUUID(fancy_name_to_id(name))
        codeblock_id = name_id;

        let imgRefOne = ref(storage, "users/" + uid + "/codeblocks/" + name_id + "/img/one/" + (imgUpload0ne.name ?? ("screenone" + imgUpload0ne.type)))
        await uploadBytes(imgRefOne, imgUpload0ne).then(() => {
            document.getElementById("publish-btn").innerHTML = "UPLOADING... => ███▒▒▒▒▒▒▒▒▒▒▒ 21%"
        })

        let imgRefTwo = ref(storage, "users/" + uid + "/codeblocks/" + name_id + "/img/two/" + imgUploadTwo.name ?? ("screentwo" + imgUpload0ne.type))
        await uploadBytes(imgRefTwo, imgUploadTwo).then(() => {
            document.getElementById("publish-btn").innerHTML = "UPLOADING... => ████▒▒▒▒▒▒▒▒▒▒ 28%"
        })

        let imgRefThree = ref(storage, "users/" + uid + "/codeblocks/" + name_id + "/img/three/" + imgUploadThree.name ?? ("screenthree" + imgUpload0ne.type))
        await uploadBytes(imgRefThree, imgUploadThree).then(() => {
            document.getElementById("publish-btn").innerHTML = "UPLOADING... => █████▒▒▒▒▒▒▒▒▒ 35%"
        })

        let imgRefFour = ref(storage, "users/" + uid + "/codeblocks/" + name_id + "/img/four/" + imgUploadFour.name ?? ("screenfour" + imgUpload0ne.type))
        await uploadBytes(imgRefFour, imgUploadFour).then(() => {
            document.getElementById("publish-btn").innerHTML = "UPLOADING... => ██████▒▒▒▒▒▒▒▒ 42%"
        })

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
        let final_interests = [];
        let interests = document.getElementsByClassName("interestpkg");
        for (let i = 0; i < interests.length; i++) {
            if (interests[i].classList.contains("interest-toggled")) {
                final_interests.push(interests[i].innerHTML);
            }
        }


        let pkgUrl = await setDoc(doc(db, "code-blocks", name_id), {
            name: profanityFilter(name),
            description: profanityFilter(longDesc),
            catchphrase: profanityFilter(desc),
            code: code,
            owner_id: uid,
            owner_username: own_username,
            current_version: version,
            downloads: 0,
            ratings: [],
            interests: final_interests,
            screenshots: [screenOneUrl, screenTwoUrl, screenThreeUrl, screenFourUrl],
            lines: code.split("\n").length,
            created: new Date().getTime(),
            id: name_id
        }).then(async r => {
            document.getElementById("publish-btn").innerHTML = "UPLOADING... => █████████████▒ 91%"
            // update user packages array with the new package
            const userRef = doc(db, "users", uid);
            await getDoc(userRef).then(async (doc) => {
                if (doc.exists()) {
                    let codeblocks = doc.data().owned_packages;
                    codeblocks.push(name_id);
                    await setDoc(userRef, {
                        owned_codeblocks: codeblocks
                    }, {merge: true}).then(r => {
                        document.getElementById("publish-btn").innerHTML = "UPLOADING... => ██████████████ 100%"
                        return name_id
                    })
                } else {
                    console.log("No such document!");
                    return name_id
                }
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

    return (
        <>
            <Navbar/>
            <h1 className="about-title">PUBLISH A CODE BLOCK</h1>
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
                <textarea className="code-editor" placeholder="⚠️ Place your final code here ⚠️" value={code}
                          onChange={e => setCode(e.target.value)}></textarea>
                <div className="upload-section">
                    <label htmlFor="img-file" className="file-input" id="gallery-upload"><BiCloudUpload
                        className="file-input-icon"></BiCloudUpload>UPLOAD IMAGES(4)</label>
                    <br/>

                </div>
                <input type="text" className="desc-input" placeholder="CODE VERSION"
                       style={{marginTop: "20px", marginBottom: "30px", fontSize: "20px"}} value={version}
                       onChange={e => setVersion(e.target.value)}/>


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
                <p className="create-package-interest-data">CATEGORIES</p>
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
                        document.getElementById("publish-btn").innerHTML = ">> PUBLISH CODE BLOCK <<"
                    }
                }} onMouseLeave={() => {
                    if (document.getElementById("publish-btn").style.pointerEvents !== "none") {
                        document.getElementById("publish-btn").innerHTML = "PUBLISH CODE BLOCK"
                    }
                }} onClick={() => {
                    if (name === "") {
                        alert("Invalid name")
                    } else {
                        document.getElementById("publish-btn").style.pointerEvents = "none"
                        document.getElementById("publish-btn").innerHTML = "UPLOADING... => ▒▒▒▒▒▒▒▒▒▒▒▒▒▒ 0%"
                        upload().then(name_id => {
                            // navigate("/packages/" + codeblock_id)
                            window.location.reload()
                        })
                    }
                }} className="publish-btn" id="publish-btn">
                    PUBLISH CODE BLOCK
                </button>
            </div>
        </>
    )
}