import React from "react";

const WhatIs = ({ data }) => {
  const { title, description, trends } = data;

  const whatIsData = {
    title: "What is Robotics and Automation?",
    description:
      "Robotics is building machines that can sense, think, and act. Automation is making tasks happen automatically without human help. Together they create systems that can do repetitive, dangerous, or precise tasks better than humans. Think of robots building cars, robots helping in surgery, or self-driving cars navigating streets.",
    trends: [
      {
        badge: "Current Trends",
        title: "What's Happening Now?",
        list: [
          "Collaborative Robots: Robots working safely alongside humans.",
          "AI-Powered Robots: Robots making intelligent decisions.",
          "Autonomous Delivery: Robots and drones delivering packages automatically.",
        ],
      },
      {
        badge: "Future Trends",
        title: "What's Next?",
        list: [
          "Robots for Medical Care: Robots helping in surgery.",
          "Self-Driving Cars: Autonomous cars navigating streets.",
          "Robots for Agriculture: Robots helping farmers.",
        ],
      },
    ],
  };
  return (
    <section className="what-is-ds">
      <div className="container data_science_main_text_container">
        <div className="what-is-content">
          <h2 className="section-title">{title}</h2>
          <p className="section-description">{description}</p>
        </div>

        <div className="trends-grid">
          {trends &&
            trends?.map((trend, index) => (
              <div className="trend-card" key={index}>
                <div className="trend-badge">{trend.badge}</div>
                <h3 className="trend-title">{trend.title}</h3>
                <ul className="trend-list">
                  {trend.list.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default WhatIs;
