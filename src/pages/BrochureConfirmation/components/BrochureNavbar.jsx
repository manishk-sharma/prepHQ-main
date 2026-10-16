import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";
import { FaPencilAlt } from "react-icons/fa";

import iotLogo from "../../../assets/brochure/iot-logo.svg";
import forbesTrophy from "../../../assets/brochure/forbes-trophy.svg";
import forbesBadge from "../../../assets/brochure/forbes-badge.svg";

const BrochureNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [programsDropdownOpen, setProgramsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProgramsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const programsList = [
    { name: "Data Science, ML, AI & GenAI", path: "/data-science" },
    { name: "Artificial Intelligence & GenAI", path: "/artificial-intelligence-genai" },
    { name: "Machine Learning with Python", path: "/machine-learning" },
    { name: "Embedded Systems and IoT", path: "/embedded-and-iot" },
    { name: "Data Analytics & Business Intelligence", path: "/data-analytics" },
    { name: "Cyber Security & Ethical Hacking", path: "/cyber-security" },
  ];

  return (
    <header className="tia-brochure-navbar">
      <div className="tia-navbar-inner">
        {/* Left Side: Academy Logo & Forbes Award */}
        <div className="tia-nav-brand-group">
          <Link to="/" className="tia-logo-link" aria-label="The IoT Academy Home">
            <img
              src={iotLogo}
              alt="The IoT Academy - Connecting the unconnected"
              className="tia-brand-logo"
            />
          </Link>

          <div className="tia-forbes-award" title="Forbes Rank #2 Visionary Companies">
            <img
              src={forbesTrophy}
              alt="Trophy"
              className="tia-award-trophy"
            />
            <img
              src={forbesBadge}
              alt="Forbes Rank #2 Visionary Companies"
              className="tia-award-badge"
            />
          </div>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          className="tia-mobile-toggle-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Right Side: Navigation Links & Login */}
        <nav className={`tia-nav-menu ${mobileMenuOpen ? "tia-nav-menu-open" : ""}`}>
          <ul className="tia-nav-links">
            <li className="tia-nav-item">
              <Link to="/" className="tia-nav-link" onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
            </li>

            <li className="tia-nav-item tia-has-dropdown" ref={dropdownRef}>
              <button
                className="tia-nav-link tia-dropdown-toggle"
                onClick={() => setProgramsDropdownOpen(!programsDropdownOpen)}
                aria-expanded={programsDropdownOpen}
              >
                <span>Programs</span>
                <ChevronDown
                  size={14}
                  className={`tia-chevron-icon ${programsDropdownOpen ? "tia-chevron-rotate" : ""}`}
                />
              </button>

              {programsDropdownOpen && (
                <ul className="tia-dropdown-menu">
                  {programsList.map((prog, idx) => (
                    <li key={idx} className="tia-dropdown-item">
                      <Link
                        to={prog.path}
                        onClick={() => {
                          setProgramsDropdownOpen(false);
                          setMobileMenuOpen(false);
                        }}
                      >
                        {prog.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            <li className="tia-nav-item">
              <a
                href="https://www.theiotacademy.co/industrial-summer-training"
                target="_blank"
                rel="noopener noreferrer"
                className="tia-nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>Industrial Summer Training Programs</span>
                <span className="tia-new-badge">New</span>
              </a>
            </li>

            <li className="tia-nav-item">
              <Link
                to="/practice"
                className="tia-nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                1PPS
              </Link>
            </li>

            <li className="tia-nav-item">
              <Link
                to="/blogs"
                className="tia-nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                Blogs
              </Link>
            </li>
          </ul>

          <div className="tia-nav-actions">
            <Link
              to="/login"
              className="tia-login-pill-btn"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Login to account"
            >
              <FaPencilAlt size={12} className="tia-login-icon" />
              <span>Login</span>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default BrochureNavbar;