import "./Navbar.scss";
import {Person, Mail} from "@material-ui/icons"

export default function Navbar({menuOpen, setMenuOpen}) {
    return (
        <div className={"navbar " + (menuOpen && "active")}>
            <div className="wrapper">
                <div className="left">
                    <a href="#intro" className="logo"> <img src={process.env.PUBLIC_URL + `/assets/logo.png`} style={{width: 50, height: 50}} alt="logo" /></a>
                    <div className="itemContainer">
                        <Person className="icon"/>
                        <span>+49 179 267 34 86</span>
                    </div>
                    <div className="itemContainer">
                        <Mail className="icon"/>
                        <span>hsevket83@gmail.com</span>
                    </div>
                </div>
                <div className="right">
                    <div className="hamburger" onClick={() => setMenuOpen(!menuOpen) }>
                        <span className="line1"></span>
                        <span className="line2"></span>
                        <span className="line3"></span>
                    </div>
                </div>
            </div>
        </div>
    )
}
