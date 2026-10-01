import React, { useRef } from "react";
import { Link } from "react-router-dom";
import "./navstrip.css";

const NavStrip = () => {
  const scrollRef = useRef(null);

  const links = [
    { name: "DSA", to: "/prepcode" },
    { name: "Practice Problems", to: "/practice" },
    { name: "C++", to: "/tutorials" },
    { name: "Java", to: "/tutorials" },
    { name: "Python", to: "/tutorials" },
    { name: "JavaScript", to: "/tutorials" },
    { name: "Data Science", to: "/data-science" },
    { name: "Machine Learning", to: "/machine-learning" },
    { name: "Courses", to: "/tutorials" },
    { name: "Linux", to: "/tutorials" },
    { name: "DevOps", to: "/tutorials" },
    { name: "SQL", to: "/tutorials" },
    { name: "Web Development", to: "/tutorials" },
    { name: "System Design", to: "/system-design" },
    { name: "Aptitude", to: "/practice" },
  ];

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -220, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 220, behavior: "smooth" });
    }
  };

  return (
    <div className="navstrip">
      <div className="container">
        <div className="navstrip-wrapper">
          <button
            type="button"
            className="scroll-btn left"
            onClick={scrollLeft}
            aria-label="Scroll left"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M7 2L3 5L7 8V2Z" fill="#ffffff" />
            </svg>
          </button>

          <ul ref={scrollRef} className="navstrip-list">
            {links.map((link, index) => (
              <li key={index}>
                <Link to={link.to} className="navstrip-link">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="scroll-btn right"
            onClick={scrollRight}
            aria-label="Scroll right"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M3 2L7 5L3 8V2Z" fill="#ffffff" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavStrip;
