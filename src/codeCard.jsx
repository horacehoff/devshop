import "./codeCard.css"
import shortNumber from "short-number"

export default function CodeCard(props) {
    const code = `
    console.log("hello world");
    `;
    return (
        <div className="code-card">
            <h2 className="code-card-title">Homebrew</h2>
            <h4 className="code-card-author">// BY <span
                style={{fontWeight: "500", color: "white"}}>{props.author}</span>
            </h4>
            <p className="code-card-downloads"><span
                style={{fontSize: "16px"}}>{shortNumber(Number(props.dwnl))}</span> downloads</p>
            <p>Sample</p>
            <p className="code-card-read-more"></p>
        </div>
    )
}