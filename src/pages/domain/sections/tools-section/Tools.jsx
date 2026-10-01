import React from "react";
import { SmartToolsSuite } from "../../../home/SmartTools";

const Tools = ({data}) => {
    const {smartTools, title, description} = data;    
  return (
    <section className="tools-section">
      <div className="container smart-tools">
        <h2 className="tools-heading">
          Handy Tools for Your{" "}
          <span className="highlight">{title}</span>
        </h2>
        <p className="tools-subheading">
         {description}
        </p>
        <SmartToolsSuite data={smartTools} />
      </div>
    </section>
  );
};

export default Tools;
