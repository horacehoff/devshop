import "./searchPackages.css"
import {IoMdSearch} from "react-icons/io";
import {useEffect, useState} from "react";
import PackageCard from "./packageCard.jsx";
import shortNumber from "short-number";
import {useParams} from "react-router-dom";
import {collection, getDocs, query, where} from "firebase/firestore";
import {db} from "./firebase.js";

export default function SearchPackages() {
    const [searchInput, setSearchInput] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const {querystr} = useParams();

    async function search(e, forcePass) {
        if ((e.key === "Enter" || forcePass) && searchInput !== "") {
            let search_results = [];
            const q = query(collection(db, "packages"), where('name', '>=', searchInput), where('name', '<=', searchInput + '\uf8ff'));
            getDocs(q).then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    search_results.push(doc.data());
                });
                setSearchResults(Array.from(search_results));
                console.log(search_results)
            })
        }
    }

    useEffect(() => {
        if (querystr && searchResults.length === 0) {
            setSearchInput(querystr);
            search({key: "Enter"}, false).then(() => {
                console.log("searched");
                setSearchResults([]);
            });
        }
    }, [searchResults]);


    return (
        <>
            <h1 className="search-title">SEARCH PACKAGES</h1>
            <IoMdSearch className="search-input-icon"/>
            <input type="text" placeholder="Search something..." value={searchInput}
                   onChange={e => setSearchInput(e.target.value)} onKeyDown={e => search(e, false)}
                   className="txt-input search-input"/>
            <ul className="packages-card-list" id="packages-card-list-one" style={{marginTop: "60px"}}>
                {searchResults.map((pkg, index) => (
                    <li key={index} className="packages-card-list-child" onClick={() => {
                        navigate("/packages/" + pkg.id)
                    }}>
                        <PackageCard dwnl={shortNumber(pkg.downloads)} author={pkg.owner_username} name={pkg.name}
                                     catchphrase={pkg.catchphrase} banner={pkg.banner}/>
                    </li>
                ))}
            </ul>
        </>
    )
}