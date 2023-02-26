import "./packageCard.css"
import shortNumber from "short-number"
import {useNavigate} from "react-router-dom";

export default function PackageCard(props) {
    const navigate = useNavigate();
    return (
        <div className="card" onClick={() => navigate("/package-page")}>
            <h2 className="card-title">Homebrew</h2>
            <h4 className="card-author">// BY <span style={{fontWeight: "500", color: "white"}}>{props.author}</span>
            </h4>
            <p className="card-downloads"><span
                style={{fontSize: "16px"}}>{shortNumber(Number(props.dwnl))}</span> downloads</p>
            <p className="card-description">{props.desc}</p>
            <p className="card-read-more"></p>
        </div>
    )
}