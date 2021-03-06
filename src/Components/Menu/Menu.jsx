import "./Menu.scss";

export default function Menu({menuOpen, setMenuOpen}) {
    return (
        <div className={"menu "+ (menuOpen && "active")}>

        <ul>
            <li>
                <a href="#intro">Home</a>
                
            </li>
            <li>
                <a href="#portfolio">Portfolio</a>
            </li>
            <li>
                <a href="#certificates">Certificates</a>
            </li>
            <li>
                <a href="#contact">Contact</a>
            </li>
        </ul>
            
        </div>
    )
}
