import "./packageCard.css"
import shortNumber from "short-number"
import {useNavigate} from "react-router-dom";
import React, {useEffect} from "react";

export default function PackageCard(props) {
    const navigate = useNavigate();
    let bannerRef = React.createRef();
    let textRef = React.createRef()
    useEffect(() => {
        bannerRef.current.style.background = "linear-gradient(0deg, rgba(0, 0, 0, .5), rgba(0, 0, 0, .5)) 0 0/cover, url('" + props.banner + "') center center/cover"
    }, []);
    return (
        <div className="card" ref={bannerRef} onMouseEnter={() => textRef.current.innerHTML = ("> " + props.readmore)}
             onMouseLeave={() => textRef.current.innerHTML = ("+ " + props.readmore)}>
            <h2 className="card-title">{props.name}</h2>
            <h4 className="card-author"><span>{props.author}</span></h4>
            <p className="card-downloads"><span>{shortNumber(Number(props.dwnl.length))}</span> {props.dwnl_local}</p>
            <p className="card-description">{props.catchphrase}</p>
            <p className="card-read-more" ref={textRef}>+ {props.readmore}</p>
        </div>
    )
}