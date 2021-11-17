import "./Intro.scss";
import {init} from "ityped";
import {useRef, useEffect} from "react";



export default function Intro() {
  const textRef = useRef();

  useEffect(() => {
    init(textRef.current, {
      showCursor: true,
      backDelay: 1500,
      backSpeed: 60,
      strings:["REACT", "Angular", "Java Script",  ".NET", "FullStack"]
    });
  }, []);
  
  return (
    <div className="intro" id="intro">
      <div className="left">
        <div className="imageContainer">
          <img src='./assets/photo.jpg' alt="hamdi" />
        </div>
      </div>
      <div className="right">
        <div className="wrapper">
          <h2> Hi There, I'm</h2>
          <h1>Hamdi Sevketbeyoglu</h1>
          <h3><span ref={textRef}></span> Developer</h3>
        </div>
        <a href="#portfolio">
        <img src='./assets/down-arrow.png' alt="arrow" />
        </a>
        
      </div>
    </div>
  );
}
