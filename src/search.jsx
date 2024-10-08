import "./search.css"
import {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {collection, getDocs, limit, query, where} from "firebase/firestore";
import {db} from "./firebase.js";
import SnippetCard from "./snippetCard.jsx";
import PackageCard from "./packageCard.jsx";
import data from "./search.json"
import card from "./packageSnippetCard.json"
import i18n from "i18next";
import {useTranslation} from "react-i18next";
//
// import DatePicker from 'react-date-picker';
//
// type ValuePiece = Date | null;
//
// type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function Search() {
    i18n.addResourceBundle("en", "search", data.en)
    i18n.addResourceBundle("en", "search", card.en)
    i18n.addResourceBundle("fr", "search", data.fr)
    i18n.addResourceBundle("fr", "search", card.fr)
    const {t} = useTranslation("search");


    const [searchInput, setSearchInput] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    const [height, setHeight] = useState("35px")

    const [pkgType, setPkgType] = useState("PACKAGES")

    const [isFiltersOpen, setIsFiltersOpen] = useState(false)
    const [userId, setUserId] = useState("")


    const [downloadMoreThan, setDownloadMoreThan] = useState(true)
    const [downloadLimit, setDownloadLimit] = useState(0);

    const [dateBefore, setDateBefore] = useState(false)
    const [dateMarker, setDateMarker] = useState("2023-01-18")


    const {querystr} = useParams();

    async function search(e, forcePass) {
        const error_check = (search_results) => {
            if (search_results.length === 0) {
                document.getElementById("search-failed").style.display = "block"
            }
        }
        document.getElementById("search-failed").style.display = "none"
        setSearchResults([])
        if ((e.key === "Enter" || forcePass) && searchInput !== "") {
            let search_results = [];
            let q = null;
            if (pkgType === "PACKAGES") {
                if (downloadLimit > 0 && userId) {
                    if (!downloadMoreThan) {
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
                    if (!downloadMoreThan) {
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
                    if (!downloadMoreThan) {
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
                    if (!downloadMoreThan) {
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
            console.log(searchResults)
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
        if (searchResults.length > 0) {
            let filtered_results = searchResults
            let should_update = false
            console.log(filtered_results)
            let dateObj = new Date(dateMarker).valueOf()
            if (dateBefore === true) {
                searchResults.forEach(e => {
                    if (dateObj < e.created) {
                        filtered_results.splice(filtered_results.indexOf(e), 1)
                        should_update = true
                    }
                })
            } else {
                searchResults.forEach(e => {
                    if (dateObj > e.created) {
                        filtered_results.splice(filtered_results.indexOf(e), 1)
                        should_update = true
                    }
                })
            }
            if (should_update) {
                console.log("yes")
                setSearchResults(filtered_results)
                setSearchResults(searchResults)
                if (filtered_results.length === 0) {
                    document.getElementById("search-failed").style.display = "block"
                }
            }
        }
    }, [searchResults]);

    return (
        <>
            <br/><br/>
            <h1 className="search-title">{t('search.search')}</h1>
            <div className="search-group">
                <input type="text" placeholder={t('search.queryholder')} value={searchInput}
                       onChange={e => setSearchInput(e.target.value)} onKeyDown={e => search(e, false)}
                       className="txt-input search-input proto-input" id="search-input" autoCapitalize="none"/>
                {/*<br/>*/}
                <div className="search-parameters">
                    <div className="search-parameters-type">
                        <select id="search-parameters-type-select" onChange={e => {
                            setPkgType(e.target.value)
                            setSearchResults([])
                            document.getElementById("search-failed").style.display = "none"
                            console.log(e.target.value)
                        }}>
                            <option value="PACKAGES">PACKAGES</option>
                            <option value="SNIPPETS">{t('search.code_snippet')}</option>
                        </select>
                        <img
                            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABiSURBVHgB7Y7bDYAwDAMzAiN0dDZhFEZgBEOlIh5S27jNp0/Kp+9iJoT4AGAvl4wkb+59LwA28pKjF0hshN4wg5GH3MNhuUcwLW+JwuSVyFEuRv6LrHjYrlssmiwN+1oINyfgwyAP2XO9oQAAAABJRU5ErkJggg=="
                            alt=""/>

                    </div>
                    <div className="search-parameters-filters" id="search-parameters-filters-btn" onClick={() => {
                        if (!isFiltersOpen) {
                            document.getElementById("search-filters-screen").style.height = "0px"
                            document.getElementById("search-filters-screen").style.display = "block"
                            window.setTimeout(() => {
                                document.getElementById("search-filters-screen").style.height = "250px"
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
                        <p className="search-parameters-filters-screen-title">-- {t('search.author')} --------------------</p>
                        <input type="text" placeholder={t('search.authorholder')}
                               className="txt-input search-input proto-input search-parameters-filters-screen-input"
                               value={userId} onChange={e => setUserId(e.target.value)}
                        />
                        <p className="search-parameters-filters-screen-title">-- {t('search.downloads')} -----------------</p>
                        <select className="search-parameters-filters-screen-select" onChange={e => {
                            if (e.target.value === "more") {
                                setDownloadMoreThan(true)
                            } else if (e.target.value === "less") {
                                setDownloadMoreThan(false)
                            }
                        }}>
                            <option value="more">{t('search.more')}</option>
                            <option value="less">{t('search.less')}</option>
                        </select>
                        <input type="number" placeholder="N/A" pattern="\d*"
                               className="txt-input search-input proto-input search-parameters-filters-screen-input search-parameters-filters-screen-input-inline"
                               value={downloadLimit} onChange={e => setDownloadLimit(e.target.value)}
                        />
                        <p className="search-parameters-filters-screen-title" style={{marginTop: "0"}}>-- CREATION DATE
                            -------------</p>
                        <select className="search-parameters-filters-screen-select" onChange={e => {
                            if (e.target.value === "before") {
                                setDateBefore(true)
                            } else if (e.target.value === "after") {
                                setDateBefore(false)
                            }
                            console.log(e.target.value)
                        }}>
                            <option value="after">{t('search.after')}</option>
                            <option value="before">{t('search.before')}</option>
                        </select>
                        <input type="date"
                               className="txt-input search-input proto-input search-parameters-filters-screen-input search-parameters-filters-screen-input-inline search-parameters-filters-screen-datepick"
                               value={dateMarker} onChange={e => {
                            setDateMarker(e.target.value)
                        }}
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
                }} className="search-btn-group" id="search-filters-btn">{t("search.btn")} 🔍
                </button>
            </div>
            <p className="search-failed" id="search-failed">{t('search.no_results')}</p>
            <ul className="packages-card-list search-packages-card-list" id="packages-card-list-one"
                style={{zIndex: "1000"}}>
                {pkgType === "PACKAGES" && (
                    <div>
                        {searchResults.map((pkg, index) => (
                            <li key={Math.random()} className="packages-card-list-child">
                                <Link to={"/packages/" + pkg.id}>
                                    <PackageCard readmore={t("card.readmore")} dwnl_local={t("card.downloads")}
                                                 dwnl={pkg.downloads} author={pkg.owner_username}
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
                                <li key={Math.random()} className="packages-card-list-child">
                                    <Link to={"/snippets/" + pkg.id}>
                                        <SnippetCard readmore={t("card.readmore")} dwnl_local={t("card.downloads")}
                                                     name={pkg.name} dwnl={pkg.downloads} author={pkg.owner_username}
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