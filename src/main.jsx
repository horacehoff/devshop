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

async function getPackages(collectionRef) {
    try {
        const q = query(collectionRef);
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => doc.data());
    } catch (error) {
        console.log('Error getting documents: ', error);
        return [];
    }
}

function App() {
    const [packages, setPackages] = useState([]);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const collectionRef = collection(db, 'packages');
                const data = await getPackages(collectionRef);
                setPackages(data);
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
    )
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <App/>
)
