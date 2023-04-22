import React, {lazy, Suspense, useEffect, useState} from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import './lazy.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./Home.jsx";
import Navbar from "./Navbar.jsx";
import Packages from "./packages.jsx";
import About from "./about.jsx";
import CreatePackage from "./createPackage.jsx";
import {collection, getDocs, query, setLogLevel} from "firebase/firestore";
import {db} from "./firebase.js";
import Pricing from "./pricing.jsx";

const SignUp = lazy(() => import('./signup.jsx'))
const SignIn = lazy(() => import('./signin.jsx'))
const CodeBlocks = lazy(() => import('./codeBlocks.jsx'))

function getPackages(collectionRef) {
    console.log("getting packages...")
    try {
        const q = query(collectionRef);
        const querySnapshot = getDocs(q).then(e => {
            console.log("packages fetched")
            return e.docs.map(doc => doc.data());
        })
    } catch (error) {
        console.log('Error getting documents: ', error);
        return [];
    }
}

function App() {
    const [packages, setPackages] = useState([]);
    setLogLevel("debug");

    useEffect(() => {
        console.log("fetching packages(function call)...")
        const fetchPackages = () => {
            try {
                const collectionRef = collection(db, 'packages');
                const data = getPackages(collectionRef).then(e => {
                    console.log("packages fetched(function call)+setPackages done")
                    setPackages(e)
                })
            } catch (error) {
                console.log('Error getting packages: ', error);
            }
        };

        fetchPackages()
    }, []);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={
                    <Home/>
                }/>
                <Route path="/publish-package" element={<CreatePackage/>}></Route>
                <Route path="/packages" element={
                    <Packages/>
                }/>
                <Route path="/code-blocks" element={
                    <Suspense fallback={
                        <>
                            <Navbar/>
                            <h1 className="packages-title">CODE<br/>BLOCKS</h1>
                            <h2 className="category-title">// CURRENTLY TRENDING</h2>
                        </>
                    }>
                        <CodeBlocks/>
                    </Suspense>
                }/>
                <Route path="/sign-up" element={
                    <Suspense fallback={<Navbar/>}>
                        <SignUp/>
                    </Suspense>
                }/>
                <Route path="/sign-in" element={
                    <Suspense fallback={<Navbar/>}>
                        <SignIn/>
                    </Suspense>
                }/>
                <Route path="/pricing" element={<Pricing/>}/>
                <Route path="/about" element={<About/>}/>
                {/*{packages.map((pkg, index) => (*/}
                {/*    <Route path={"/" + pkg.name} element={<PackagePage pkg={pkg}/>}/>*/}
                {/*))}*/}
            </Routes>
        </BrowserRouter>
    )
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <App/>
)
