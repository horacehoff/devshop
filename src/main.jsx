import React, {lazy, Suspense} from 'react'
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

const SignUp = lazy(() => import('./signup.jsx'))
const SignIn = lazy(() => import('./signin.jsx'))
const CodeBlocks = lazy(() => import('./codeBlocks.jsx'))

ReactDOM.createRoot(document.getElementById('root')).render(
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
            </Routes>
        </BrowserRouter>
    </React.StrictMode>,
)
