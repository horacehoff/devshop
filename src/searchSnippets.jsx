import "./searchPackages.css"
import {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {collection, getDocs, limit, query, where} from "firebase/firestore";
import {db} from "./firebase.js";
import SnippetCard from "./snippetCard.jsx";

export default function SearchSnippets() {
    const [searchInput, setSearchInput] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const {querystr} = useParams();

    async function search(e, forcePass) {
        document.getElementById("search-failed").style.display = "none"
        if ((e.key === "Enter" || forcePass) && searchInput !== "") {
            let search_results = [];
            const q = query(collection(db, "snippets"), where('name', '>=', searchInput), where('name', '<=', searchInput + '\uf8ff'), limit(9));
            getDocs(q).then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    search_results.push(doc.data());
                });
                setSearchResults(Array.from(search_results));
                if (search_results.length === 0) {
                    document.getElementById("search-failed").style.display = "block"
                }
            })
        } else if (searchInput === "" && e.key === "Enter") {
            document.getElementById("search-input").style.borderColor = "rgba(255, 0, 0, 1)"
            setTimeout(() => document.getElementById("search-input").style.borderColor = "", 2000)
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
            <br/><br/>
            <h1 className="search-title">SEARCH SNIPPETS</h1>
            <div className="search-group">
                <input type="text" placeholder="@SEARCH" value={searchInput}
                       onChange={e => setSearchInput(e.target.value)} onKeyDown={e => search(e, false)}
                       className="txt-input search-input " id="search-input"/>
                <button onClick={() => {
                    if (searchInput === "") {
                        document.getElementById("search-input").style.borderColor = "rgba(255, 0, 0, 1)"
                        setTimeout(() => document.getElementById("search-input").style.borderColor = "", 2000)
                    } else {
                        search("", true)
                    }
                }}>🔍
                </button>
            </div>
            <p className="search-failed" id="search-failed">No search results</p>
            <ul className="packages-card-list" id="packages-card-list-one" style={{marginTop: "60px"}}>
                {searchResults.map((pkg, index) => (
                    <li key={index} className="packages-card-list-child" onClick={() => {
                        navigate("/packages/" + pkg.id)
                    }}>
                        <Link to={"/snippets/" + pkg.id} style={{textDecoration: "none", color: "white"}}>
                            <SnippetCard name={pkg.name} dwnl={pkg.downloads} author={pkg.owner_username}
                                         description={pkg.catchphrase}/>
                        </Link>
                    </li>
                ))}
            </ul>

        </>
    )
}