import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./Home.jsx";
import SignUp from "./signup.jsx";
import SignIn from "./signin.jsx";
import Packages from "./packages.jsx";
import CodeBlocks from "./codeBlocks.jsx";
import PackagePage from "./packagePage.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/package-page" element={<PackagePage/>}/>
                <Route path="/packages" element={<Packages/>}/>
                <Route path="/code-blocks" element={<CodeBlocks/>}/>
                <Route path="/sign-up" element={<SignUp/>}/>
                <Route path="/sign-in" element={<SignIn/>}/>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>,
)
