import { useEffect, useState } from "react";
import PortfolioList from "../PortfolioList/PortfolioList";
import "./Portfolio.scss";
import {
  reactPortfolio,
  dotnetPortfolio,
  angularPortfolio,
  pythonPortfolio,
  mobilePortfolio
  
} from "../../data";

export default function Portfolio() {
  const [selected, setSelected] = useState("react");
  const [data, setData] = useState([]);
  const list = [
    {
      id: "react",
      title: "React Projects",
    },
    {
      id: "dotnet",
      title: ".Net Projects",
    },
    {
      id: "angular",
      title: "Angular Projects",
    },
    {
      id: "python",
      title: "Python Projects",
    },
    {
      id: "mobile",
      title: "Mobile App Projects",
    }
  ];
  useEffect(() => {
    switch (selected) {
      case "react":
        setData(reactPortfolio);
        break;
      case "dotnet":
        setData(dotnetPortfolio);
        break;
      case "angular":
        setData(angularPortfolio);
        break;
      case "python":
        setData(pythonPortfolio);
        break;
      case "mobile":
        setData(mobilePortfolio);
        break;

      default:
        setData(reactPortfolio);
    }
  }, [selected]);

  return (
    <div className="portfolio" id="portfolio">
      <h1>Portfolio</h1>
      <ul>
        {list.map((item) => (
          <PortfolioList
            title={item.title}
            active={selected === item.id}
            setSelected={setSelected}
            id={item.id}
          />
        ))}
      </ul>
      <div className="container">
        {data.map((d) => (
         <a href={d.url} rel="noreferrer" target="_blank"> 
         <div className="item">
            <img src={d.img} alt="" />
            <h3>{d.title}</h3>
          </div>
          </a>
        ))}
      </div>
    </div>
  );
}
