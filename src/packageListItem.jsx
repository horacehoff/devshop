import "./packageListItem.css"
import shortNumber from "short-number";

export default function PackageListItem(props) {
    return (
        <>
            <div className="pkg-item-container">
                <img src={props.banner} alt="Banner"/>
                <p className="pkg-item-title">{props.name}</p>
                <p className="pkg-item-desc">{props.catchphrase}</p>
                <p className="pkg-item-downloads">
                    <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_489_191220)">
                            <path d="M12 3v18m0 0l-7-6m7 6l7-6" stroke="currentColor" strokeWidth="2"
                                  strokeLinecap="round" strokeLinejoin="round"></path>
                        </g>
                        <defs>
                            <clipPath id="clip0_489_191220">
                                <path fill="currentColor" d="M0 0H24V24H0z"></path>
                            </clipPath>
                        </defs>
                    </svg>
                    {shortNumber(Number(props.dwnl))}
                </p>
            </div>
        </>
    )
}