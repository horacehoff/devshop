import React, {Suspense, lazy} from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import './lazy.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./Home.jsx";
import Navbar from "./Navbar.jsx";
const SignUp = lazy(() => import('./signup.jsx'))
const SignIn = lazy(() => import('./signin.jsx'))
const Packages = lazy(() => import('./packages.jsx'))
const CodeBlocks = lazy(() => import('./codeBlocks.jsx'))
const PackagePage = lazy(() => import('./packagePage.jsx'))

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={
                    <Home/>
                }/>
                <Route path="/package-page" element={
                    <Suspense fallback={<Navbar/>}>
                        <PackagePage/>
                    </Suspense>
                }/>
                <Route path="/packages" element={
                    <Suspense fallback={
                        <>
                            <Navbar/>
                            <h1 className="packages-title">PACKAGES</h1>
                            <h2 className="category-title">// CURRENTLY TRENDING</h2>
                        </>
                    }>
                        <Packages/>
                    </Suspense>
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
            </Routes>
        </BrowserRouter>
    </React.StrictMode>,
)
