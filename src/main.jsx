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
import Pricing from "./pricing.jsx";
import "./firebase.js"
import {db} from "./firebase.js";
import PackagePage from "./packagePage.jsx";

const SignUp = lazy(() => import('./signup.jsx'))
const SignIn = lazy(() => import('./signin.jsx'))
const CodeBlocks = lazy(() => import('./codeBlocks.jsx'))

async function getPackages(collectionRef) {
    console.log("getting packages...")
    try {
        const q = query(collectionRef);
        const querySnapshot = await getDocs(q);
        console.log("packages fetched")
        return querySnapshot.docs.map(doc => doc.data());
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
        const fetchPackages = async () => {
            try {
                const collectionRef = collection(db, 'packages');
                const data = await getPackages(collectionRef);
                setPackages(data);
                console.log("packages fetched(function call)+setPackages done")
            } catch (error) {
                console.log('Error getting packages: ', error);
            }
        };

        fetchPackages().then(r => console.log('Packages fetched'));
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
                    <SignUp/>
                }/>
                <Route path="/sign-in" element={
                    <SignIn/>
                }/>
                <Route path="/pricing" element={<Pricing/>}/>
                <Route path="/about" element={<About/>}/>
                {packages.map((pkg, index) => (
                    <Route path={"/" + pkg.name} element={<PackagePage pkg={pkg}/>}/>
                ))}
            </Routes>
        </BrowserRouter>
    )
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <App/>
)
