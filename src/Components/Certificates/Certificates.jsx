import { useState } from "react";
import "./Certificates.scss";

export default function Certificates() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const data = [
    {
      id: "1",
      icon: "./assets/net.png",
      title: ".Net Developer",
      desc:
        "SQL and relational databases structures, C#, .NET Framework implementations, Web Programming Introduction, HTML5, CSS3, Bootstrap, JavaScript, Jquery, ASP .NET, and .NET Core Architecture, API Designing, Object-Oriented Programming, and SOLID principles",
      img:
      "./assets/bilge-ada.png", 
      web: "https://akademi.bilgeadam.com/courses/yazilim-dot-net-egitimi/"
    },
    {
      id: "2",
      icon: "./assets/react.png",
      title: "React Developer",
      desc:
        "ES6, JSX, React Components, Interaction between components, Lifecycle methods, Mixing components state, Prop Types, Hooks.",
      img:
      "./assets/redi.png",
      web: "https://www.redi-school.org/redimunich"
    },
    {
      id: "3",
      icon: "./assets/html.png",
      title: "The Web Developer Bootcamp 2021",
      desc:
        "HTML, CSS, JS, Node.js and Express, Mongo DB",
      img:
        "./assets/udemy.png",
      web: "https://www.udemy.com/course/the-web-developer-bootcamp/" 
    },
  ];

  const handleClick = (way) => {
    way === "left"
      ? setCurrentSlide(currentSlide > 0 ? currentSlide - 1 : 2)
      : setCurrentSlide(currentSlide < data.length - 1 ? currentSlide + 1 : 0);
  };
  
  return (
    <div className="certificates" id="certificates">
    <h1>Certificates</h1>
      <div
        className="slider"
        style={{ transform: `translateX(-${currentSlide * 100}vw)` }}
      >
        {data.map((d) => (
          <div className="container">
            <div className="item">
              <div className="left">
                <div className="leftContainer">
                  <div className="imgContainer">
                    <img src={d.icon} alt="" />
                  </div>
                  <h2>{d.title}</h2>
                  <p>{d.desc}</p>
                  <a href={d.web} rel="noreferrer" target="_blank">{d.web}</a>
                </div>
              </div>
              <div className="right">
                <img
                  src={d.img}
                  alt={d.title}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <img
        src="assets/arrow.png"
        className="arrow left"
        alt=""
        onClick={() => handleClick("left")}
      />
      <img
        src="assets/arrow.png"
        className="arrow right"
        alt=""
        onClick={() => handleClick()}
      />
    </div>
  );
}
