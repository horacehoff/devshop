import React, {lazy, Suspense} from 'react'
import ReactDOM from 'react-dom/client'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import "./firebase.js"


import './index.css'
import './lazy.css'


import Home from "./Home.jsx";
import Packages from "./packages.jsx";
import About from "./about.jsx";
import CreatePackage from "./createPackage.jsx";
import Pricing from "./pricing.jsx";
import PackagePage from "./packagePage.jsx";
import SignUp from "./signup.jsx";
import SignIn from "./signin.jsx";
import ResetPassword from "./resetPassword.jsx";
import AccountSettings from "./accountSettings.jsx";
import AccountPage from "./accountPage.jsx";
import EditPackage from "./editPackage.jsx";
import SearchPackages from "./searchPackages.jsx";


const CodeBlocks = lazy(() => import('./codeBlocks.jsx'))

function App() {
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
                <Route path="/search-packages/:query?" element={<SearchPackages/>}/>
                <Route path="/code-blocks" element={
                    <Suspense fallback={
                        <>
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
                <Route path="/account" element={<AccountSettings/>}/>
                <Route path="/reset-password" element={<ResetPassword/>}/>
                <Route path="/pricing" element={<Pricing/>}/>
                <Route path="/about" element={<About/>}/>
                <Route path="/packages/:id" element={<PackagePage/>}/>
                <Route path="/packages/:id/edit" element={<EditPackage/>}/>
                <Route path="/users/:id" element={<AccountPage/>}/>
            </Routes>
        </BrowserRouter>
    )
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <App/>
)