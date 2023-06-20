import "./searchPackages.css"
import Navbar from "./Navbar.jsx";
import {IoMdSearch} from "react-icons/all.js";
import {collection, getDocs, query, where} from "firebase/firestore";
import {db} from "./firebase.js";
import {useState} from "react";

export default function SearchPackages() {
    const [searchInput, setSearchInput] = useState("")

    async function search(e, forcePass) {
        if (e.key === "Enter" || forcePass) {
            const q = query(collection(db, "packages"), where("name", "==", searchInput));
            const querySnapshot = await getDocs(q);
            console.log("yo")
            querySnapshot.forEach((doc) => {
                console.log(doc.id, " => ", doc.data());
            })
        }
    }

    return (
        <>
            <Navbar/>
            <h1 className="about-title">SEARCH PACKAGES</h1>
            <IoMdSearch className="search-input-icon"/>
            <input type="text" placeholder="Search something..." value={searchInput}
                   onChange={e => setSearchInput(e.target.value)} className="txt-input search-input"
                   onKeyDown={e => search(e, false)}/>
            <ul className="packages-card-list" id="packages-card-list-one">
            </ul>

        </>
    )
}