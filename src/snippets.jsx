import "./packages.css"
import "./snippets.css"
import SnippetCard from "./snippetCard.jsx";
import {Link, useNavigate} from "react-router-dom";
import {IoMdSearch} from "react-icons/io";
import {collection, getDocs, limit, orderBy, query, where} from "firebase/firestore";
import {useEffect, useState} from "react";
import {db, user_data} from "./firebase.js";
import {Helmet} from "react-helmet";

export default function Snippets() {
    const navigate = useNavigate();
    window.mobileCheck = function () {
        let check = false;
        (function (a) {
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
        })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    };

    function handler(e) {
        const isTouchPad = e.wheelDeltaY ? e.wheelDeltaY === -3 * e.deltaY : e.deltaMode === 0;
        if (!isTouchPad && !window.mobileCheck()) {
            const packagesCardListChild = document.getElementsByClassName("packages-card-list-child");
            for (let i = 0; i < packagesCardListChild.length; i++) {
                packagesCardListChild[i].style.marginRight = "15px";
                packagesCardListChild[i].style.marginTop = "10px";
                document.getElementsByClassName("card")[i].style.width = "calc(100vw / 3 - 50px)";
                document.getElementsByClassName("card-title")[i].style.maxWidth = "calc(100vw / 3 - 50px - 15px)";
            }
            const packagesCardList = document.getElementsByClassName("packages-card-list");
            for (let i = 0; i < packagesCardList.length; i++) {
                packagesCardList[i].style.transform = "translateY(-20px)";
                packagesCardList[i].style.whiteSpace = "normal";
                const packagesCardListLoop = document.getElementsByClassName("card-title");
                for (let i = 0; i < packagesCardListLoop.length; i++) {
                    packagesCardListLoop[i].style.whiteSpace = "nowrap";
                    packagesCardListLoop[i].style.overflow = "scroll"
                }
            }
        }
        document.removeEventListener("wheel", handler, false);
    }

    document.addEventListener("wheel", handler, {passive: false});
    // setLogLevel("debug");


    const [trendingCodeBlockData, setTrendingCodeBlockData] = useState([]);
    const [lastCodeBlockData, setLastCodeBlockData] = useState([]);
    const [similarCodeBlockData, setSimilarCodeBlockData] = useState([]);
    useEffect(() => {
        setTrendingCodeBlockData([])
        setLastCodeBlockData([])
        setSimilarCodeBlockData([])
        const q = query(collection(db, "snippets"), orderBy("downloads", "desc"), limit(9));
        getDocs(q).then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                setTrendingCodeBlockData(prevState => [...prevState, doc.data()]);
            })
        })
        const q1 = query(collection(db, "snippets"), orderBy("created", "desc"), limit(9));
        getDocs(q1).then((querySnapshot) => {
            let run = false
            querySnapshot.forEach((doc) => {
                setLastCodeBlockData(prevState => [...prevState, doc.data()]);
                run = true
            })
            if (!run) {
                document.getElementById("category-title").style.display = "none"
                document.getElementById("empty-txt").style.display = "block"
                document.getElementById("empty-btn").style.display = "block"
            }
        })
        if (user_data && user_data.interests.length > 0) {
            const q2 = query(collection(db, "snippets"), where("interests", "array-contains-any", Array.from(user_data.interests)), limit(9));
            getDocs(q2).then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    console.log("fuck yeah")
                    setSimilarCodeBlockData(prevState => [...prevState, doc.data()]);
                    document.getElementById("for-you-section").style.display = "block"
                })
            })
        }
    }, [user_data]);


    return (
        <>
            <Helmet>
                <meta
                    content="Find code snippets here on DEVSHOP and save yourself countless hours of coding"
                    name="description"/>
                <meta content="Snippets" name="title"/>


                <meta content="https://dev-shop.vercel.app/snippets" property="twitter:url"/>
                <meta content="Snippets" property="twitter:title"/>
                <meta content="Find code snippets here on DEVSHOP and save yourself countless hours of coding"
                      property="twitter:description"/>


                <meta content="https://dev-shop.vercel.app/snippets" property="og:url"/>
                <meta content="Snippets" property="og:title"/>
                <meta content="Find code snippets here on DEVSHOP and save yourself countless hours of coding"
                      property="og:description"/>
            </Helmet>
            <h1 className="packages-title snippets-title">SNIPPETS</h1>
            <h4 className="packages-subtitle">FIND AND PUBLISH CODE SNIPPETS</h4>
            <Link className="secondary search-btn" id="package-publish-btn"
                  to="/publish-snippet">+ PUBLISH A SNIPPET
            </Link>
            <Link className="secondary search-btn" id="package-search-btn"
                  style={{marginLeft: "10px", maxWidth: "173px"}}
                  to="/search/"><IoMdSearch
                style={{position: "relative", top: "1px"}}/> SEARCH SNIPPETS
            </Link>
            <div id="for-you-section" style={{display: "none"}}>
                <h2 className="category-title">// FOR YOU</h2>
                <ul className="packages-card-list">
                    {similarCodeBlockData.map((pkg, index) => (
                        <li key={index} className="packages-card-list-child">
                            <Link to={"/snippets/" + pkg.id} style={{textDecoration: "none", color: "white"}}>
                                <SnippetCard name={pkg.name} dwnl={pkg.downloads} author={pkg.owner_username}
                                             description={pkg.catchphrase}/>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
            <h2 className="category-title">// CURRENTLY TRENDING</h2>
            <ul className="packages-card-list">
                <p id="empty-txt">{"NO SNIPPETS - PUBLISH THE FIRST ONE ?"}</p>
                <button className="primary" id="empty-btn" onClick={() => navigate("/publish-snippet")}>MAKE HISTORY
                </button>
                {trendingCodeBlockData.map((pkg, index) => (
                    <li key={index} className="packages-card-list-child">
                        <Link to={"/snippets/" + pkg.id} style={{textDecoration: "none", color: "white"}}>
                            <SnippetCard name={pkg.name} dwnl={pkg.downloads} author={pkg.owner_username}
                                         description={pkg.catchphrase}/>
                        </Link>
                    </li>
                ))}
            </ul>
            <h2 className="category-title" id="category-title">// RECENTLY CREATED</h2>
            <ul className="packages-card-list">
                {lastCodeBlockData.map((pkg, index) => (
                    <li key={index} className="packages-card-list-child">
                        <Link to={"/snippets/" + pkg.id} style={{textDecoration: "none", color: "white"}}>
                            <SnippetCard name={pkg.name} dwnl={pkg.downloads} author={pkg.owner_username}
                                         description={pkg.catchphrase}/>
                        </Link>
                    </li>
                ))}
            </ul>
        </>
    )
}