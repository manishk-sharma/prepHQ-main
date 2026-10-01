import React from 'react'
import "../assets/css/headerbannerheading.css";

const HeaderBannerHeading = ({ title, highlight }) => {
  return (
      <h1 className="headingcommon">
            {title} 
            <span>
              {highlight} 
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="91"
                height="9"
                viewBox="0 0 91 9"
                fill="none"
              >
                <path
                  d="M50.3884 0C25.7207 0 6.51791 1.92 0 2.88H37.9793C33.9683 3.24 24.1413 4.176 16.9215 5.04C9.70165 5.904 2.63223 8.04 0 9C13.838 4.68 66.4325 3.12 91 2.88V0H50.3884Z"
                  fill="#57CC99"
                />
              </svg>
            </span>
          </h1>
  )
}

export default HeaderBannerHeading
