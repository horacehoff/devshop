import "./accountPage.css"
import Navbar from "./Navbar.jsx";
import {SiGithub} from "react-icons/si";

export default function AccountPage(props) {
    const usr = props.user;

    return (
        <>
            <Navbar/>
            <div className="user_banner"></div>
            <div className="user_pfp"></div>
            <h1 className="user_name">{usr.username}</h1>
            <p className="user_id">{"@" + "257052639663862809476246572688635667782"} ·<span
                className="user_github"><SiGithub className="user_github_icon"/> <span
                className="user_github_id">just-a-mango</span></span></p>
            <p className="user_bio_title">I am a passionate developer with a strong focus on creating elegant and
                efficient solutions to complex problems. I also like mangoes which are cooler.</p>


        </>
    )

}