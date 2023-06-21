import "./searchPackages.css"
import Navbar from "./Navbar.jsx";
import {IoMdSearch} from "react-icons/all.js";
import {useEffect, useState} from "react";
import PackageCard from "./packageCard.jsx";
import shortNumber from "short-number";
import {useParams} from "react-router-dom";

export default function SearchPackages({packages}) {
    // const [searchInput, setSearchInput] = useState("")
    // const [searchResults, setSearchResults] = useState([])
    // const query = useParams().query
    //
    // async function search(query, e, forcePass) {
    //     if ((e.key === "Enter" || forcePass) && query !== "") {
    //         let search_results = []
    //         for (let i = 0; i < packages.length; i++) {
    //             if (packages[i].name.toLowerCase().includes(query.toLowerCase()) || packages[i].owner_username.toLowerCase().includes(query.toLowerCase())) {
    //                 setSearchResults(search_results.push(packages[i]))
    //             }
    //         }
    //         console.log(search_results)
    //         setSearchResults(Array.from(search_results))
    //     }
    // }
    //
    // useEffect(() => {
    //     if (query) {
    //         setSearchInput(query)
    //         search(query, {key: 'Enter'}, true).then(() => {
    //             console.log("searched")
    //             setSearchResults([])
    //         })
    //     }
    // }, [searchResults])
    const [searchInput, setSearchInput] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const {query} = useParams();

    async function search(e, forcePass) {
        if (e.key === "Enter" || forcePass) {
            let search_results = [];
            for (let i = 0; i < packages.length; i++) {
                if (
                    packages[i].name.toLowerCase().includes(searchInput.toLowerCase()) ||
                    packages[i].owner_username.toLowerCase().includes(searchInput.toLowerCase())
                ) {
                    search_results.push(packages[i]);
                }
            }
            console.log(search_results);
            setSearchResults(Array.from(search_results));
        }
    }

    useEffect(() => {
        if (query && searchResults.length === 0) {
            setSearchInput(query);
            search({key: "Enter"}, false).then(() => {
                console.log("searched");
                setSearchResults([]);
            });
        }
    }, [searchResults]);


    return (
        <>
            <Navbar/>
            <h1 className="about-title">SEARCH PACKAGES</h1>
            <IoMdSearch className="search-input-icon"/>
            <input type="text" placeholder="Search something..." value={searchInput}
                   onChange={e => setSearchInput(e.target.value)} className="txt-input search-input"
                   onKeyDown={e => search(searchInput, e, false)}/>
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