import "./packageCard.css"
import shortNumber from "short-number"
import {useNavigate} from "react-router-dom";
import React, {useEffect} from "react";

export default function PackageCard(props) {
    const navigate = useNavigate();
    let bannerRef = React.createRef();
    useEffect(() => {
        bannerRef.current.style.background = "linear-gradient(0deg, rgba(0, 0, 0, .5), rgba(0, 0, 0, .5)) 0 0/cover, url('" + props.banner + "') center center/cover"
    }, []);
    return (
        <div className="card" ref={bannerRef}>
            <h2 className="card-title">{props.name}</h2>
            <h4 className="card-author">// BY <span style={{fontWeight: "500", color: "white"}}>{props.author}</span>
            </h4>
            <p className="card-downloads"><span
                style={{fontSize: "16px"}}>{shortNumber(Number(props.dwnl))}</span> downloads</p>
            <p className="card-description">{props.catchphrase}</p>
            <p className="card-read-more"></p>
        </div>
    )
}