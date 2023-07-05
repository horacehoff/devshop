import "./codeCard.css"
import shortNumber from "short-number"
import {useNavigate} from "react-router-dom";
import React, {useEffect} from "react";

export default function CodeCard(props) {
    const navigate = useNavigate();
    let bannerRef = React.createRef();

    function generateRandom(min = 0, max = 100) {

        // find diff
        let difference = max - min;

        // generate random number
        let rand = Math.random();

        // multiply with difference
        rand = Math.floor(rand * difference);

        // add with min value
        rand = rand + min;

        return rand;
    }

    useEffect(() => {
        bannerRef.current.style.backgroundSize = generateRandom() + "%"
    }, []);

    return (
        <div className="card code-card" ref={bannerRef}>
            <h2 className="card-title code-card-title">{props.name}</h2>
            <h4 className="card-author"><span>{props.author}</span></h4>
            <p className="card-downloads"><span
                style={{fontSize: "16px"}}>{shortNumber(Number(props.dwnl))}</span> downloads</p>
            <p className="card-description code-description">{props.description}</p>
            <p className="card-read-more code-read-more"></p>
        </div>
    )
}