import React from "react";
import { Link } from "react-router-dom";

const ResourceCard = ({ title, subtitle, desc, btn, href }) => {
  return (
    <div className="resource-card">
      <h3 className="resource-title">{title}</h3>
      <div className="resource-content">
        <h4>{subtitle}</h4>
        <p>{desc}</p>
      </div>
      <a
        style={{ textDecoration: "none" }}
        href={href}
        className="resource-btn text-decoration-none"
        target="_blank"
      >
        {btn}
      </a>
    </div>
  );
};

export default ResourceCard;