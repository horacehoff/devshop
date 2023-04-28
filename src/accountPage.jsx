import "./accountPage.css"
import Navbar from "./Navbar.jsx";

export default function AccountPage(props) {
    const usr = props.user;

    return (
        <>
            <Navbar/>
            <div className="user_banner"></div>
            <div className="user_pfp"></div>
            <h1 className="user_name">{usr.username}</h1>
        </>

    )

}