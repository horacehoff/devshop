import "./snippetCard.css"
import shortNumber from "short-number"
import {useNavigate} from "react-router-dom";
import React, {useEffect} from "react";

export default function SnippetCard(props) {
    const navigate = useNavigate();
    let bannerRef = React.createRef();

    function generateRandom(min = 50, max = 100) {

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

    function getDarkColor() {
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += Math.floor(Math.random() * 10);
        }
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    // function hexToRgb(hex) {
    //     let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    //     return result ? {
    //         r: parseInt(result[1], 16),
    //         g: parseInt(result[2], 16),
    //         b: parseInt(result[3], 16)
    //     } : null;
    // }

    useEffect(() => {
        bannerRef.current.style.backgroundSize = generateRandom() + "%"
        bannerRef.current.style.backgroundImage = "radial-gradient(at 22% 68%, rgb(" + getDarkColor().r + "," + getDarkColor().g + "," + getDarkColor().b + ") 0, transparent 97%), radial-gradient(at 96% 5%, rgb(24, 41, 227) 0, transparent 84%), radial-gradient(at 17% 34%, rgb(" + getDarkColor().r + "," + getDarkColor().g + "," + getDarkColor().b + ") 0, transparent 42%), radial-gradient(at 33% 33%, rgb(" + getDarkColor().r + "," + getDarkColor().g + "," + getDarkColor().b + ") 0, transparent 62%), radial-gradient(at 71% 34%, rgb(" + getDarkColor().r + "," + getDarkColor().g + "," + getDarkColor().b + ") 0, transparent 50%), radial-gradient(at 14% 98%, rgb(" + getDarkColor().r + "," + getDarkColor().g + "," + getDarkColor().b + ") 0, transparent 57%)"
        console.log(getDarkColor())
    }, []);

    return (
        <div className="card code-card" ref={bannerRef}>
            <h2 className="card-title code-card-title">{props.name}</h2>
            <h4 className="card-author"><span>{props.author}</span></h4>
            <p className="card-downloads"><span
                style={{fontSize: "16px"}}>{shortNumber(props.dwnl.length)}</span> downloads</p>
            <p className="card-description code-description">{props.description}</p>
            <p className="card-read-more code-read-more"></p>
        </div>
    )
}