import {Route, Routes} from "react-router-dom";
import Home from "./Home.jsx";
import CreatePackage from "./createPackage.jsx";
import Packages from "./packages.jsx";
import SearchPackages from "./searchPackages.jsx";
import React from "react";
import SignUp from "./signup.jsx";
import SignIn from "./signin.jsx";
import AccountSettings from "./accountSettings.jsx";
import ResetPassword from "./resetPassword.jsx";
import Pricing from "./pricing.jsx";
import About from "./about.jsx";
import PackagePage from "./packagePage.jsx";
import EditPackage from "./editPackage.jsx";
import AccountPage from "./accountPage.jsx";
import CodeBlocks from "./codeBlocks.jsx";

export const MyRoutes = () => {
    return (
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
                <CodeBlocks/>
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
    );
};