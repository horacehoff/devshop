import "./searchPackages.css"
import {useEffect, useState} from "react";
import shortNumber from "short-number";
import {Link, useParams} from "react-router-dom";
import {collection, getDocs, limit, query, where} from "firebase/firestore";
import {db} from "./firebase.js";
import PackageListItem from "./packageListItem.jsx";
import SnippetCard from "./snippetCard.jsx";

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
                <input type="text" placeholder="@SEARCH" value={searchInput}
                       onChange={e => setSearchInput(e.target.value)} onKeyDown={e => search(e, false)}
                       className="txt-input search-input " id="search-input"/>
                <br/>
                <button className="search-filters">
                    <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 8h9m9 0h-3M3 16h3m15 0h-9" stroke="currentColor" strokeWidth="2"
                              strokeLinecap="round"></path>
                        <circle cx="15" cy="8" r="3" stroke="currentColor" strokeWidth="2"></circle>
                        <circle cx="9" cy="16" r="3" stroke="currentColor" strokeWidth="2"></circle>
                    </svg>
                    <span style={{position: "relative", top: "-12px"}}>FILTERS</span></button>
                <button className="search-filters search-filters-type search-filters-type-hover"
                        id="search-filters-type" onClick={() => {
                    if (height === "35px") {
                        document.getElementById("search-filters-type").classList.remove("search-filters-type-hover")
                        document.getElementById("search-filters-type-icon").style.rotate = "180deg"
                        document.getElementById("search-filters-type-icon").style.opacity = "0"
                        document.getElementById("search-filters-pkg").style.right = "10px"
                        document.getElementById("search-filters-type").style.height = "67px"
                        setHeight("67px")
                        document.getElementById("search-filters-type").classList.remove("search-filters-type-hover")
                        document.getElementById("search-filters-pkg-hover").classList.add("search-filters-option")
                        document.getElementById("search-filters-snippets").classList.add("search-filters-option")
                    }
                }}>
                    <svg id="search-filters-type-icon" width="24" height="24" opacity="1" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_489_191278)">
                            <g clipPath="url(#clip1_489_191278)" stroke="currentColor" strokeWidth="2"
                               strokeLinecap="round" strokeLinejoin="round">
                                <path
                                    d="M4 9l5.172 5.172c1.333 1.333 2 2 2.828 2 .828 0 1.495-.667 2.828-2L20 9"></path>
                                <path
                                    d="M4 9l5.172 5.172c1.333 1.333 2 2 2.828 2 .828 0 1.495-.667 2.828-2L20 9"></path>
                            </g>
                        </g>
                        <defs>
                            <clipPath id="clip0_489_191278">
                                <path fill="currentColor" d="M0 0H24V24H0z"></path>
                            </clipPath>
                            <clipPath id="clip1_489_191278">
                                <path fill="currentColor" transform="rotate(180 12 12)" d="M0 0H24V24H0z"></path>
                            </clipPath>
                        </defs>
                    </svg>
                    <span style={{position: "relative", top: "-12px"}} id="search-filters-pkg"><span
                        id="search-filters-pkg-hover" onClick={() => {
                        if (height === "67px") {
                            document.getElementById("search-filters-type-icon").style.rotate = "0deg"
                            document.getElementById("search-filters-type-icon").style.opacity = "1"
                            document.getElementById("search-filters-pkg").style.right = "0px"
                            document.getElementById("search-filters-type").style.height = "35px"
                            setHeight("35px")
                            document.getElementById("search-filters-type").classList.add("search-filters-type-hover")
                            document.getElementById("search-filters-pkg-hover").classList.remove("search-filters-option")
                            document.getElementById("search-filters-snippets").classList.remove("search-filters-option")
                            if (pkgType === "PACKAGES") {
                                setPkgType("PACKAGES")
                            } else {
                                setPkgType("SNIPPETS")
                            }
                        }
                    }}>{pkgType === "PACKAGES" ? (
                        <span id="search-filters-pkg-hover">PACKAGES</span>
                    ) : (
                        <span id="search-filters-pkg-hover">SNIPPETS</span>
                    )}</span><br/><br/><span style={{position: "relative", left: "13px"}} id="search-filters-snippets"
                                             onClick={() => {
                                                 if (height === "67px") {
                                                     document.getElementById("search-filters-type-icon").style.rotate = "0deg"
                                                     document.getElementById("search-filters-type-icon").style.opacity = "1"
                                                     document.getElementById("search-filters-pkg").style.right = "0px"
                                                     document.getElementById("search-filters-type").style.height = "35px"
                                                     setHeight("35px")
                                                     document.getElementById("search-filters-type").classList.add("search-filters-type-hover")
                                                     document.getElementById("search-filters-pkg-hover").classList.remove("search-filters-option")
                                                     document.getElementById("search-filters-snippets").classList.remove("search-filters-option")
                                                 }
                                                 if (pkgType === "PACKAGES") {
                                                     setPkgType("SNIPPETS")
                                                 } else {
                                                     setPkgType("PACKAGES")
                                                 }

                                             }}>{pkgType === "PACKAGES" ? (
                        <span id="search-filters-pkg-hover">SNIPPETS</span>
                    ) : (
                        <span id="search-filters-pkg-hover">PACKAGES</span>
                    )}</span></span></button>
                <br/>
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
            <ul className="packages-card-list" id="packages-card-list-one" style={{marginTop: "60px"}}>
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
                            <li key={index} className="packages-card-list-child">
                                <Link to={"/packages/" + pkg.id} style={{textDecoration: "none", color: "white"}}>
                                    <PackageListItem
                                        dwnl={shortNumber(pkg.downloads)}
                                        author={pkg.owner_username}
                                        name={pkg.name}
                                        catchphrase={pkg.catchphrase}
                                        banner={pkg.banner}
                                    />
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