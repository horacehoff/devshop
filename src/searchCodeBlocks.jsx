import "./searchPackages.css"
import {IoMdSearch} from "react-icons/all.js";
import {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {collection, getDocs, query, where} from "firebase/firestore";
import {db} from "./firebase.js";
import CodeCard from "./codeCard.jsx";

export default function SearchCodeBlocks() {
    const [searchInput, setSearchInput] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const {querystr} = useParams();

    async function search(e, forcePass) {
        if ((e.key === "Enter" || forcePass) && searchInput !== "") {
            let search_results = [];
            const q = query(collection(db, "code-blocks"), where('name', '>=', searchInput), where('name', '<=', searchInput + '\uf8ff'));
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
            <h1 className="about-title">SEARCH CODE BLOCKS</h1>
            <IoMdSearch className="search-input-icon"/>
            <input type="text" placeholder="Search something..." value={searchInput}
                   onChange={e => setSearchInput(e.target.value)} onKeyDown={e => search(e, false)}
                   className="txt-input search-input"/>
            <ul className="packages-card-list" id="packages-card-list-one" style={{marginTop: "60px"}}>
                {searchResults.map((pkg, index) => (
                    <li key={index} className="packages-card-list-child" onClick={() => {
                        navigate("/packages/" + pkg.id)
                    }}>
                        <Link to={"/codeblocks/" + pkg.id} style={{textDecoration: "none", color: "white"}}>
                            <CodeCard name={pkg.name} dwnl={pkg.downloads} author={pkg.owner_username}
                                      description={pkg.catchphrase}/>
                        </Link>
                    </li>
                ))}
            </ul>

        </>
    )
}