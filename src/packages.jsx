import "./packages.css"
import Navbar from "./Navbar.jsx";
import PackageCard from "./packageCard.jsx";
import {db} from "./firebase.js";
import {useEffect, useState} from "react";
import {collection, doc, getDoc, getDocs, limit, orderBy, query} from "firebase/firestore";
import {useNavigate} from "react-router-dom";


export default function Packages() {
    const navigate = useNavigate();

    function handler(e) {
        const isTouchPad = e.wheelDeltaY ? e.wheelDeltaY === -3 * e.deltaY : e.deltaMode === 0;
        if (!isTouchPad) {
            const packagesCardListChild = document.getElementsByClassName("packages-card-list-child");
            for (let i = 0; i < packagesCardListChild.length; i++) {
                packagesCardListChild[i].style.marginRight = "15px";
                packagesCardListChild[i].style.marginTop = "10px";
                document.getElementsByClassName("card")[i].style.width = "calc(100vw / 3 - 50px)";
            }
            const packagesCardList = document.getElementsByClassName("packages-card-list");
            for (let i = 0; i < packagesCardList.length; i++) {
                packagesCardList[i].style.transform = "translateY(-20px)";
                packagesCardList[i].style.whiteSpace = "normal";
            }
        }
        document.removeEventListener("wheel", handler, false);
    }

    document.addEventListener("wheel", handler, {passive: false});


    const [packages, setPackages] = useState([]);
    useEffect(() => {
        const collectionRef = collection(db, 'packages')
        const q = query(collectionRef, orderBy("downloads", "desc"), orderBy("created", "desc"), limit(9))
        getDocs(q)
            .then((querySnapshot) => {
                const packageData = [];
                querySnapshot.forEach((doc) => {
                    packageData.push(doc.data());
                });
                setPackages(packageData);
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
    }, []);

    const getUsername = async (userId) => {
        const userDocRef = doc(collection(db, 'users'), userId);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            return userData.username;
        } else {
            throw new Error(`User with ID ${userId} not found`);
        }
    };

    return (
        <>
            <Navbar/>
            <h1 className="packages-title">PACKAGES</h1>
            <h2 className="category-title">// CURRENTLY TRENDING</h2>
            <ul className="packages-card-list" id="packages-card-list">
                {packages.map((pkg, index) => (
                    <li key={index} className="packages-card-list-child" onClick={() => {
                        navigate("/" + pkg.name)
                    }}>
                        <PackageCard dwnl={pkg.downloads} author={pkg.owner_username} name={pkg.name}
                                     desc={pkg.description} banner={pkg.banner}/>
                    </li>
                ))}
            </ul>
            <h2 className="category-title">// RECENTLY CREATED</h2>
            <ul className="packages-card-list" id="packages-card-list">
            </ul>
        </>
    )
}