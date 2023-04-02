import React, {lazy, Suspense, useEffect, useState} from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import './lazy.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./Home.jsx";
import Navbar from "./Navbar.jsx";
import Packages from "./packages.jsx";
import PackagePage from "./packagePage.jsx";
import About from "./about.jsx";
import CreatePackage from "./createPackage.jsx";
import {collection, getDocs, query} from "firebase/firestore";
import {db} from "./firebase.js";

const SignUp = lazy(() => import('./signup.jsx'))
const SignIn = lazy(() => import('./signin.jsx'))
const CodeBlocks = lazy(() => import('./codeBlocks.jsx'))

function getPackages(collectionRef) {
    const q = query(collectionRef)
    return getDocs(q)
        .then((querySnapshot) => {
            const packageData = [];
            querySnapshot.forEach((doc) => {
                packageData.push(doc.data());
            });
            return packageData;
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
}

function App() {
    const [packages, setPackages] = useState([]);

    useEffect(() => {
        const collectionRef = collection(db, 'packages');
        getPackages(collectionRef)
            .then((data) => {
                setPackages(data);
            })
            .catch((error) => {
                console.log("Error getting packages: ", error);
            });
    }, []);

    return (
        <React.StrictMode>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={
                        <Home/>
                    }/>
                    <Route path="/publish-package" element={<CreatePackage/>}></Route>
                    <Route path="/package-page" element={
                        <PackagePage/>
                    }/>
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
                    <Route path="/about" element={<About/>}/>
                    {packages.map((pkg, index) => (
                        <Route path={"/" + pkg.name} element={<PackagePage pkg={pkg}/>}/>
                    ))}
                </Routes>
            </BrowserRouter>
        </React.StrictMode>
    )
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <App/>
)
