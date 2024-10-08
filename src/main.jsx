import React from 'react'
import ReactDOM from 'react-dom/client'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import './index.css'
import "./translate.js"
import "./utility.js"


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
import Search from "./search.jsx";
import Snippets from "./snippets.jsx";
import CreateSnippet from "./createSnippet.jsx";
import SnippetPage from "./snippetPage.jsx";
import EditSnippet from "./editSnippet.jsx";
import Navbar from "./Navbar.jsx";
import Feedback from "./Feedback.jsx";
import Footer from "./Footer.jsx";


function App() {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("/worker.js")
    })
    return (
        <BrowserRouter>
            <Navbar/>
            <Routes>
                <Route path="/" element={
                    <Home/>
                }/>
                <Route path="/home" element={<>
                    <h1>TEST</h1>
                </>
                }/>
                <Route path="/publish-package" element={<CreatePackage/>}></Route>
                <Route path="/packages" element={
                    <Packages/>
                }/>
                <Route path="/search/:query?" element={<Search/>}/>
                {/*<Route path="/snippets/q/:query?" element={<SearchSnippets/>}/>*/}
                <Route path="/snippets" element={<Snippets/>}/>
                <Route path="/publish-snippet" element={
                    <CreateSnippet/>
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
                <Route path="/feedback" element={<Feedback/>}/>
                <Route path="/packages/:id" element={<PackagePage/>}/>
                <Route path="/packages/:id/edit" element={<EditPackage/>}/>
                <Route path="/snippets/:id/" element={<SnippetPage/>}/>
                <Route path="/snippets/:id/edit" element={<EditSnippet/>}/>
                <Route path="/users/:id" element={<AccountPage/>}/>
                <Route path="*" element={<Home/>}/>

            </Routes>
            <Footer/>
        </BrowserRouter>
    )
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <App/>
)

let userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
if (["Europe/Paris", "Europe/Luxembourg", "Europe/Monaco", "America/Guyana", "Africa/Porto-Novo", "Africa/Ouagadougou", "Africa/Kinshasa", "Africa/Lubumbashi", "Africa/Brazzaville", "Africa/Abidjan", "Africa/Libreville", "Africa/Conakry", "Africa/Niame", "Africa/Dakar", "Africa/Lome"].includes(userTimeZone)) {
    console.log("yep he's french")
}