import React, {lazy, Suspense, useEffect, useState} from 'react'
import ReactDOM from 'react-dom/client'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import "./firebase.js"
import fancy_name_to_id from "./utility.js";


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
// const Packages = lazy(() => import('./packages.jsx'))
// const About = lazy(() => import('./about.jsx'))
// const CreatePackage = lazy(() => import('./createPackage.jsx'))
// const Pricing = lazy(() => import('./pricing.jsx'))
// const PackagePage = lazy(() => import('./packagePage.jsx'))
// const SignUp = lazy(() => import('./signup.jsx'))
// const SignIn = lazy(() => import('./signin.jsx'))
// const ResetPassword = lazy(() => import('./resetPassword.jsx'))
// const AccountSettings = lazy(() => import('./accountSettings.jsx'))
// const AccountPage = lazy(() => import('./accountPage.jsx'))
// const EditPackage = lazy(() => import('./editPackage.jsx'))


const CodeBlocks = lazy(() => import('./codeBlocks.jsx'))


async function getPackages(collectionRef) {
    console.log('getting packages...');
    try {
        const {getDocs, query} = await import('firebase/firestore');
        const q = query(collectionRef);
        const querySnapshot = await getDocs(q);
        console.log('packages fetched');
        return querySnapshot.docs.map((doc) => doc.data());
    } catch (error) {
        console.log('Error getting documents: ', error);
        return [];
    }
}

async function fetchUsersData() {
    try {
        const {db} = await import('./firebase.js');
        const {collection} = await import('firebase/firestore');
        const collectionRef = collection(db, 'users');
        return await getPackages(collectionRef);
    } catch (error) {
        console.log('Error getting users: ', error);
        return [];
    }
}

function App() {
    const [users, setUsers] = useState([]);


    useEffect(() => {
        console.log('fetching packages (function call)...');

        fetchUsersData().then((data) => {
            setUsers(data);
            console.log('users fetched (function call) + setUsers done');
        });
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
                {
                    users.map((user, index) => (
                        <Route path={"/users/" + fancy_name_to_id(user.username)}
                               element={<AccountPage user={user}/>}/>
                    ))
                }
            </Routes>
        </BrowserRouter>
    )
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <App/>
)