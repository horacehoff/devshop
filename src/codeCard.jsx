import "./codeCard.css"
import shortNumber from "short-number"
import {useNavigate} from "react-router-dom";
import React from "react";

export default function CodeCard(props) {
    const navigate = useNavigate();
    let bannerRef = React.createRef();
    return (
        <div className="card code-card" ref={bannerRef}>
            <h2 className="card-title code-card-title">{props.name}</h2>
            <h4 className="card-author"><span>{props.author}</span></h4>
            <p className="card-downloads"><span
                style={{fontSize: "16px"}}>{shortNumber(Number(props.dwnl))}</span> downloads</p>
            <p className="card-description">{props.description}</p>
            <p className="card-read-more"></p>
        </div>
    )
}