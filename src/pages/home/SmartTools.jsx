import React from 'react'
import { Link } from "react-router-dom";

import salaryPredictor from "../../assets/img/home/salarypredictor.webp";
import mira from "../../assets/img/home/mira.webp";
import discussionForum from "../../assets/img/home/discussionforum.webp";
import '../home/home.css'

const SmartTools = ({data}) => {
  return (
    <section className="smart-tools">
      <div className="container">
        <h4 className="heading">
          Smart Tools to Ace Every <span>Tech Interview</span>
        </h4>
        <SmartToolsSuite data={data} />
      </div>
    </section >
  )
}

 const smartTools = [
    {
      bgImage: salaryPredictor,
      title: "Salary Predictor",
      desc: "Check out the salary checker to help you grow your career! It's a handy tool that provides helpful information to improve your job prospects and earnings.",
      url: "https://www.theiotacademy.co/salary-predictor",
    },
    {
      bgImage: mira,
      title: "MIRA",
      desc: "Quickly reviews your responses, offering feedback on clarity, tone, and relevance to enhance coherence, confidence, and professionalism.",
      url: "https://www.mira.upskillcampus.com/",
    },
    {
      bgImage: discussionForum,
      title: "Discussion Forum",
      desc: "Get all of your questions answered and have a discussion about them. Join the community of experts and fellow aspirants.",
      url: "https://www.forum.upskillcampus.com/",
    },
  ];

export const SmartToolsSuite = ({data = smartTools}) => {
 
  return <>
    <div className="items">
      {data?.map((item, index) => {
        const words = item.desc.split(' ');
        const isTruncated = words.length > 15;
        const shortDesc = isTruncated ? words.slice(0, 15).join(' ') + '...' : item.desc;

        return (
          <div className="item" key={index}>
            <img src={item.bgImage} alt={item.title} />
            <div className="content">
              <h5 className="head">{item.title}</h5>
              <div className="desc-wrapper">
                <p className="desc-short">{shortDesc}</p>
                {isTruncated && <div className="desc-full">{item.desc}</div>}
              </div>
              <Link to={item.url} target="_blank">
                Explore
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="11"
                  height="11"
                  viewBox="0 0 11 11"
                  fill="none"
                >
                  <path
                    d="M9.97767 2.39931L10.157 8.50897L8.12125 8.44909L7.98357 3.77917L1.69425 10.0685L0.212154 8.58639L6.50147 2.29707L1.83155 2.15939L1.77167 0.12362L7.88133 0.302975C9.00588 0.336724 9.94392 1.27476 9.97767 2.39931Z"
                    fill="#074568"
                  />
                </svg>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  </>
}

export default SmartTools
