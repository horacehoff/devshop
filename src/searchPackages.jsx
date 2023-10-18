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
    const [isFiltersOpen, setIsFiltersOpen] = useState(false)
    const [userId, setUserId] = useState("")
    const [downloadMoreThan, setDownloadMoreThan] = useState(true)
    const [downloadLimit, setDownloadLimit] = useState(0);


    const {querystr} = useParams();

    async function search(e, forcePass) {
        const error_check = (search_results) => {
            if (search_results.length === 0) {
                document.getElementById("search-failed").style.display = "block"
            }
        }
        document.getElementById("search-failed").style.display = "none"
        if ((e.key === "Enter" || forcePass) && searchInput !== "") {
            let search_results = [];
            let q = null;
            if (pkgType === "PACKAGES") {
                if (downloadLimit > 0 && userId) {
                    if (downloadMoreThan) {
                        q = query(collection(db, "packages"), where('owner_username', '>=', userId), where('owner_username', '<=', userId + '\uf8ff'));
                        getDocs(q).then((querySnapshot) => {
                            let q_results = []
                            querySnapshot.forEach((doc) => {
                                q_results.push(doc.data())
                            });

                            let final_results = []
                            q_results.forEach((doc) => {
                                if (doc.name.includes(searchInput) && doc.downloads >= downloadLimit) {
                                    final_results.push(doc)
                                }
                            })

                            setSearchResults(Array.from(final_results));
                            error_check(final_results)
                        })
                    } else {
                        q = query(collection(db, "packages"), where('owner_username', '>=', userId), where('owner_username', '<=', userId + '\uf8ff'));
                        getDocs(q).then((querySnapshot) => {
                            let q_results = []
                            querySnapshot.forEach((doc) => {
                                q_results.push(doc.data())
                            });

                            let final_results = []
                            q_results.forEach((doc) => {
                                if (doc.name.includes(searchInput) && doc.downloads <= downloadLimit) {
                                    final_results.push(doc)
                                }
                            })

                            setSearchResults(Array.from(final_results));
                            error_check(final_results)
                        })
                    }
                } else if (downloadLimit > 0) {
                    if (downloadMoreThan) {
                        q = query(collection(db, "packages"), where('name', '>=', searchInput), where('name', '<=', searchInput + '\uf8ff'));
                        getDocs(q).then((querySnapshot) => {
                            let q_results = []
                            querySnapshot.forEach((doc) => {
                                q_results.push(doc.data())
                            });

                            let final_results = []
                            q_results.forEach((doc) => {
                                if (doc.downloads >= downloadLimit && final_results.length < 18) {
                                    final_results.push(doc)
                                }
                            })

                            setSearchResults(Array.from(final_results));
                            error_check(final_results)
                        })
                    } else {
                        q = query(collection(db, "packages"), where('name', '>=', searchInput), where('name', '<=', searchInput + '\uf8ff'));
                        getDocs(q).then((querySnapshot) => {
                            let q_results = []
                            querySnapshot.forEach((doc) => {
                                q_results.push(doc.data())
                            });

                            let final_results = []
                            q_results.forEach((doc) => {
                                if (doc.downloads <= downloadLimit) {
                                    final_results.push(doc)
                                }
                            })

                            setSearchResults(Array.from(final_results));
                            error_check(final_results)
                        })
                    }
                } else if (userId) {
                    q = query(collection(db, "packages"), where('owner_username', '>=', userId), where('owner_username', '<=', userId + '\uf8ff'));
                    getDocs(q).then((querySnapshot) => {
                        let q_results = []
                        querySnapshot.forEach((doc) => {
                            q_results.push(doc.data())
                        });

                        let final_results = []
                        q_results.forEach((doc) => {
                            if (doc.name.includes(searchInput) && final_results.length < 9) {
                                final_results.push(doc)
                            }
                        })

                        setSearchResults(Array.from(final_results));
                        error_check(final_results)

                    })
                } else {
                    console.log("chosen path")
                    console.log(searchInput)
                    q = query(collection(db, "packages"), where('name', '>=', searchInput), where('name', '<=', searchInput + '\uf8ff'), limit(9));
                    // const end = searchInput.replace(/.$/, c => String.fromCharCode(c.charCodeAt(0) + 1));
                    // q = query(collection(db, "packages"), where('name', '>=', searchInput), where('name', '<=', end), limit(9));
                    // q = query(collection(db, "packages"), where('name', '==', searchInput), limit(9));
                    getDocs(q).then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            search_results.push(doc.data());
                        });
                        setSearchResults(Array.from(search_results));
                        error_check(search_results)
                    })
                }
            } else {
                if (downloadLimit > 0 && userId) {
                    if (downloadMoreThan) {
                        q = query(collection(db, "snippets"), where('owner_username', '>=', userId), where('owner_username', '<=', userId + '\uf8ff'));
                        getDocs(q).then((querySnapshot) => {
                            let q_results = []
                            querySnapshot.forEach((doc) => {
                                q_results.push(doc.data())
                            });

                            let final_results = []
                            q_results.forEach((doc) => {
                                if (doc.name.includes(searchInput) && doc.downloads >= downloadLimit) {
                                    final_results.push(doc)
                                }
                            })

                            setSearchResults(Array.from(final_results));
                            error_check(final_results)
                        })
                    } else {
                        q = query(collection(db, "snippets"), where('owner_username', '>=', userId), where('owner_username', '<=', userId + '\uf8ff'));
                        getDocs(q).then((querySnapshot) => {
                            let q_results = []
                            querySnapshot.forEach((doc) => {
                                q_results.push(doc.data())
                            });

                            let final_results = []
                            q_results.forEach((doc) => {
                                if (doc.name.includes(searchInput) && doc.downloads <= downloadLimit) {
                                    final_results.push(doc)
                                }
                            })

                            setSearchResults(Array.from(final_results));
                            error_check(final_results)
                        })
                    }
                } else if (downloadLimit > 0) {
                    if (downloadMoreThan) {
                        q = query(collection(db, "snippets"), where('name', '>=', searchInput), where('name', '<=', searchInput + '\uf8ff'));
                        getDocs(q).then((querySnapshot) => {
                            let q_results = []
                            querySnapshot.forEach((doc) => {
                                q_results.push(doc.data())
                            });

                            let final_results = []
                            q_results.forEach((doc) => {
                                if (doc.downloads >= downloadLimit && final_results.length < 18) {
                                    final_results.push(doc)
                                }
                            })

                            setSearchResults(Array.from(final_results));
                            error_check(final_results)
                        })
                    } else {
                        q = query(collection(db, "snippets"), where('name', '>=', searchInput), where('name', '<=', searchInput + '\uf8ff'));
                        getDocs(q).then((querySnapshot) => {
                            let q_results = []
                            querySnapshot.forEach((doc) => {
                                q_results.push(doc.data())
                            });

                            let final_results = []
                            q_results.forEach((doc) => {
                                if (doc.downloads <= downloadLimit) {
                                    final_results.push(doc)
                                }
                            })

                            setSearchResults(Array.from(final_results));
                            error_check(final_results)
                        })
                    }
                } else if (userId) {
                    q = query(collection(db, "snippets"), where('owner_username', '>=', userId), where('owner_username', '<=', userId + '\uf8ff'));
                    getDocs(q).then((querySnapshot) => {
                        let q_results = []
                        querySnapshot.forEach((doc) => {
                            q_results.push(doc.data())
                        });

                        let final_results = []
                        q_results.forEach((doc) => {
                            if (doc.name.includes(searchInput) && final_results.length < 9) {
                                final_results.push(doc)
                            }
                        })

                        setSearchResults(Array.from(final_results));
                        error_check(final_results)

                    })
                } else {
                    q = query(collection(db, "snippets"), where('name', '>=', searchInput), where('name', '<=', searchInput + '\uf8ff'), limit(9));
                    getDocs(q).then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            search_results.push(doc.data());
                        });
                        setSearchResults(Array.from(search_results));
                        error_check(search_results)
                    })
                }
            }

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
            <h1 className="search-title">SEARCH</h1>
            <div className="search-group">
                <input type="text" placeholder="@search_query" value={searchInput}
                       onChange={e => setSearchInput(e.target.value)} onKeyDown={e => search(e, false)}
                       className="txt-input search-input proto-input" id="search-input" autoCapitalize="none"/>
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
                        <img style={{
                            position: "absolute",
                            scale: "0.6",
                            top: "6px"
                        }}
                             src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABiSURBVHgB7Y7bDYAwDAMzAiN0dDZhFEZgBEOlIh5S27jNp0/Kp+9iJoT4AGAvl4wkb+59LwA28pKjF0hshN4wg5GH3MNhuUcwLW+JwuSVyFEuRv6LrHjYrlssmiwN+1oINyfgwyAP2XO9oQAAAABJRU5ErkJggg=="
                             alt=""/>

                    </div>
                    <div className="search-parameters-filters" id="search-parameters-filters-btn" onClick={() => {
                        if (!isFiltersOpen) {
                            document.getElementById("search-filters-screen").style.height = "0px"
                            document.getElementById("search-filters-screen").style.display = "block"
                            window.setTimeout(() => {
                                document.getElementById("search-filters-screen").style.height = "170px"
                                document.getElementById("search-filters-btn").style.pointerEvents = "none"
                                document.getElementById("search-filters-btn").style.filter = "brightness(0.75)"
                                document.getElementById("search-parameters-filters-btn").style.color = "white"
                            }, 1)
                            setIsFiltersOpen(true)
                        } else {
                            document.getElementById("search-filters-screen").style.height = "0px"
                            document.getElementById("search-filters-btn").style.pointerEvents = "all"
                            document.getElementById("search-filters-btn").style.filter = "brightness(1)"
                            document.getElementById("search-parameters-filters-btn").style.color = null
                            window.setTimeout(() => {
                                document.getElementById("search-filters-screen").style.display = "none"
                            }, 500)
                            setIsFiltersOpen(false)
                        }
                    }}>
                        <span><svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path
                            d="M3 8h9m9 0h-3M3 16h3m15 0h-9" stroke="currentColor" strokeWidth="2"
                            strokeLinecap="round"></path><circle cx="15" cy="8" r="3" stroke="currentColor"
                                                                 strokeWidth="2"></circle><circle cx="9" cy="16" r="3"
                                                                                                  stroke="currentColor"
                                                                                                  strokeWidth="2"></circle></svg> FILTERS</span>
                    </div>
                    <div className="search-parameters-filters-screen" id="search-filters-screen">
                        <p className="search-parameters-filters-screen-title">-- AUTHOR --------------------</p>
                        <input type="text" placeholder="@user_id"
                               className="txt-input search-input proto-input search-parameters-filters-screen-input"
                               value={userId} onChange={e => setUserId(e.target.value)}
                        />
                        <p className="search-parameters-filters-screen-title">-- DOWNLOADS -----------------</p>
                        {/*<input type="range" className="search-parameters-filters-screen-slider"/>*/}
                        {/*<input type="range" className="search-parameters-filters-screen-slider"*/}
                        {/*       style={{position: "absolute"}}/>*/}
                        <select className="search-parameters-filters-screen-select" style={{
                            border: "solid 1px #2D2D2D",
                            paddingLeft: "5px",
                            paddingRight: "5px",
                            paddingTop: "7px",
                            paddingBottom: "7px",
                            borderRadius: "8px",
                            top: "-18px",
                            display: "inline",
                            appearance: "none",
                            cursor: "pointer"
                        }} onChange={e => {
                            if (e.target.value === "more") {
                                setDownloadMoreThan(true)
                            } else if (e.target.value === "less") {
                                setDownloadMoreThan(false)
                            }
                        }}>
                            <option value="more">{"MORE THAN"}</option>
                            <option value="less">{"LESS THAN"}</option>
                        </select>
                        <input type="number" placeholder="N/A"
                               className="txt-input search-input proto-input search-parameters-filters-screen-input search-parameters-filters-screen-input-inline"
                               value={downloadLimit} onChange={e => setDownloadLimit(e.target.value)}
                        />
                    </div>
                </div>
                <button onClick={() => {
                    if (searchInput === "") {
                        console.log("working")
                        document.getElementById("search-input").style.border = "solid 1px red"
                        // setTimeout(() => document.getElementById("search-input").style.borderColor = "", 2000)
                    } else {
                        search("", true)
                    }
                }} className="search-btn-group" id="search-filters-btn">SEARCH 🔍
                </button>
            </div>
            <p className="search-failed" id="search-failed">No search results</p>
            <ul className="packages-card-list" id="packages-card-list-one"
                style={{marginTop: "170px", position: "relative", zIndex: "-1"}}>
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