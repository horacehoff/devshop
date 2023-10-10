import "./searchPackages.css"
import {useEffect, useState} from "react";
import shortNumber from "short-number";
import {Link, useParams} from "react-router-dom";
import {collection, getDocs, limit, query, where} from "firebase/firestore";
import {db} from "./firebase.js";
import SnippetCard from "./snippetCard.jsx";
import PackageCard from "./packageCard.jsx";

export default function SearchPackages() {
    const [searchInput, setSearchInput] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [height, setHeight] = useState("35px")
    const [pkgType, setPkgType] = useState("PACKAGES")
    const {querystr} = useParams();

    async function search(e, forcePass) {
        document.getElementById("search-failed").style.display = "none"
        if ((e.key === "Enter" || forcePass) && searchInput !== "") {
            let search_results = [];
            let q = null;
            if (pkgType === "PACKAGES") {
                q = query(collection(db, "packages"), where('name', '>=', searchInput), where('name', '<=', searchInput + '\uf8ff'), limit(9));
            } else {
                q = query(collection(db, "snippets"), where('name', '>=', searchInput), where('name', '<=', searchInput + '\uf8ff'), limit(9));
            }
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
        // document.getElementById("search-filters-type").style.height = "35px"
        if (querystr && searchResults.length === 0) {
            setSearchInput(querystr);
            search({key: "Enter"}, false).then(() => {
                console.log("searched");
                setSearchResults([]);
            });
        }
    }, [searchResults]);

    function close_button() {
        document.getElementById("search-filters-type-icon").style.rotate = "0deg"
        document.getElementById("search-filters-type-icon").style.opacity = "1"
        document.getElementById("search-filters-pkg").style.right = "0"
        document.getElementById("search-filters-type").style.height = "35px"
        document.getElementById("search-filters-type").classList.add("search-filters-type-hover")
        document.getElementById("search-filters-pkg-hover").classList.remove("search-filters-option")
        document.getElementById("search-filters-snippets").classList.remove("search-filters-option")
    }


    return (
        <>
            <br/><br/>
            <h1 className="search-title">SEARCH</h1>
            <div className="search-group">
                <input type="text" placeholder="@search_query" value={searchInput}
                       onChange={e => setSearchInput(e.target.value)} onKeyDown={e => search(e, false)}
                       className="txt-input search-input proto-input" id="search-input"/>
                {/*<br/>*/}
                <div className="search-parameters">
                    <div className="search-parameters-type">
                        <select id="search-parameters-type-select" onChange={e => {
                            setPkgType(e.target.value)
                            setSearchResults([])
                            console.log(e.target.value)
                        }}>
                            <option value="PACKAGES">PACKAGES</option>
                            <option value="SNIPPETS">CODE SNIPPET</option>
                        </select>
                    </div>
                    <div className="search-parameters-filters">
                        <span><svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path
                            d="M3 8h9m9 0h-3M3 16h3m15 0h-9" stroke="currentColor" strokeWidth="2"
                            strokeLinecap="round"></path><circle cx="15" cy="8" r="3" stroke="currentColor"
                                                                 strokeWidth="2"></circle><circle cx="9" cy="16" r="3"
                                                                                                  stroke="currentColor"
                                                                                                  strokeWidth="2"></circle></svg> FILTERS</span>
                        <div className="search-parameters-filters-screen">
                            <p className="search-parameters-filters-screen-title">AUTHOR</p>
                            <input type="text" placeholder="@user_id"
                                   className="txt-input search-input proto-input search-parameters-filters-screen-input"/>
                            <p className="search-parameters-filters-screen-title">DOWNLOADS</p>
                            <input type="range" className="search-parameters-filters-screen-slider"/>
                        </div>
                    </div>
                </div>
                <button onClick={() => {
                    if (searchInput === "") {
                        document.getElementById("search-input").style.borderColor = "rgba(255, 0, 0, 1)"
                        setTimeout(() => document.getElementById("search-input").style.borderColor = "", 2000)
                    } else {
                        search("", true)
                    }
                }} className="search-btn-group">SEARCH 🔍
                </button>
            </div>
            <p className="search-failed" id="search-failed">No search results</p>
            <ul className="packages-card-list" id="packages-card-list-one" style={{marginTop: "170px"}}>
                {/*{*/}
                {/*    pkgType === "PACKAGES" && {searchResults.map((pkg, index) => (*/}
                {/*            <li key={index} className="packages-card-list-child" onClick={() => {*/}
                {/*                navigate("/packages/" + pkg.id)*/}
                {/*            }}>*/}
                {/*                <PackageListItem dwnl={shortNumber(pkg.downloads)} author={pkg.owner_username} name={pkg.name}*/}
                {/*                                 catchphrase={pkg.catchphrase} banner={pkg.banner}/>*/}
                {/*            </li>*/}
                {/*        ))}*/}
                {/*}*/}
                {pkgType === "PACKAGES" && (
                    <div>
                        {searchResults.map((pkg, index) => (
                            <li key={index} className="packages-card-list-child" onClick={() => {
                                navigate("/packages/" + pkg.id)
                            }}>
                                <Link to={"/packages/" + pkg.id} style={{textDecoration: "none", color: "white"}}>
                                    <PackageCard dwnl={shortNumber(pkg.downloads)} author={pkg.owner_username}
                                                 name={pkg.name}
                                                 catchphrase={pkg.catchphrase} banner={pkg.banner}/>
                                </Link>
                            </li>
                        ))}
                    </div>
                )}
                {
                    pkgType === "SNIPPETS" && (
                        <div>
                            {searchResults.map((pkg, index) => (
                                <li key={index} className="packages-card-list-child">
                                    <Link to={"/snippets/" + pkg.id} style={{textDecoration: "none", color: "white"}}>
                                        <SnippetCard name={pkg.name} dwnl={pkg.downloads} author={pkg.owner_username}
                                                     description={pkg.catchphrase}/>
                                    </Link>
                                </li>
                            ))}
                        </div>
                    )
                }

            </ul>
        </>
    )
}