import {Route, Routes} from "react-router-dom";
import Home from "../src/Home.jsx";
import CreatePackage from "../src/createPackage.jsx";
import Packages from "../src/packages.jsx";
import SearchPackages from "../src/searchPackages.jsx";
import React from "react";
import SignUp from "../src/signup.jsx";
import SignIn from "../src/signin.jsx";
import AccountSettings from "../src/accountSettings.jsx";
import ResetPassword from "../src/resetPassword.jsx";
import Pricing from "../src/pricing.jsx";
import About from "../src/about.jsx";
import PackagePage from "../src/packagePage.jsx";
import EditPackage from "../src/editPackage.jsx";
import AccountPage from "../src/accountPage.jsx";
import CodeBlocks from "../src/codeBlocks.jsx";

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