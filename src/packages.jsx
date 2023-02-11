import "./packages.css"
import Navbar from "./Navbar.jsx";
import PackageCard from "./packageCard.jsx";

export default function Packages() {
    return (
        <>
            <Navbar/>
            <h1 className="packages-title">PACKAGES</h1>
            <h2 className="category-title">// CURRENTLY TRENDING</h2>
            <ul className="packages-card-list">
                <li><PackageCard dwnl="55566564" author="hombrewTeam"
                                 desc="Homebrew offers a wide variety of packages to download. Its available platforms are macOS and Linux, and Windows support is coming soon"/>
                </li>
                <li><PackageCard dwnl="55566564" author="hombrewTeam"
                                 desc="Homebrew offers a wide variety of packages to download. Its available platforms are macOS and Linux, and Windows support is coming soon"/>
                </li>
                <li><PackageCard dwnl="55566564" author="hombrewTeam"
                                 desc="Homebrew offers a wide variety of packages to download. Its available platforms are macOS and Linux, and Windows support is coming soon"/>
                </li>
                <li><PackageCard dwnl="55566564" author="hombrewTeam"
                                 desc="Homebrew offers a wide variety of packages to download. Its available platforms are macOS and Linux, and Windows support is coming soon"/>
                </li>
            </ul>
        </>
    )
}