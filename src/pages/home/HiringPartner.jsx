import React from 'react'

import accenture from "../../assets/img/hiring-partner/accenture.webp";
import capgemini from "../../assets/img/hiring-partner/capgemini.webp";
import cocaCola from "../../assets/img/hiring-partner/coca-cola.webp";
import deloitte from "../../assets/img/hiring-partner/deloitte.webp";
import fedex from "../../assets/img/hiring-partner/fedex.webp";
import genpact from "../../assets/img/hiring-partner/genpact.webp";
import kpmg from "../../assets/img/hiring-partner/kpmg.webp";
import sunPharma from "../../assets/img/hiring-partner/sun-pharma.webp";

const HiringPartner = () => {

    const hiringPartnerData = [
        capgemini,
        accenture,
        kpmg,
        deloitte,
        genpact,
        sunPharma,
        fedex,
        cocaCola,        
    ];

  return (
    <>
        <div className="partners">
            {hiringPartnerData.map((item, index)=> (
                <div className="item" key={index}>
                    <img src={item} alt="coca-cola logo" />
                </div>
            ))}
        </div>
        <div className="counts-number">
            <span>
              <strong>100+</strong> Hiring Partners
            </span>
        </div>
    </>
  )
}

export default HiringPartner
