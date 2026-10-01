// src/pages/coding/layout/CodingSidebar.jsx

import React from "react";
import { NavLink } from "react-router-dom";

import {
  FaCode,
  FaTrophy,
  FaHistory,
  FaUser,
  FaLayerGroup,
} from "react-icons/fa";

import "./CodingSidebar.css";

const CodingSidebar = () => {
  return (
    <div className="coding-sidebar">

      {/* Logo */}
      <div className="sidebar-logo">
        <FaCode className="logo-icon" />
        <span>PrepHQ Code</span>
      </div>

      {/* Navigation */}
      <div className="sidebar-menu">

        <NavLink
          to="/coding"
          end
          className="sidebar-link"
        >
          <FaLayerGroup />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/coding/problemset"
          className="sidebar-link"
        >
          <FaCode />
          <span>Problem Set</span>
        </NavLink>

        <NavLink
          to="/coding/leaderboard"
          className="sidebar-link"
        >
          <FaTrophy />
          <span>Leaderboard</span>
        </NavLink>

        <NavLink
          to="/coding/submissions"
          className="sidebar-link"
        >
          <FaHistory />
          <span>Submissions</span>
        </NavLink>

        <NavLink
          to="/coding/profile"
          className="sidebar-link"
        >
          <FaUser />
          <span>Profile</span>
        </NavLink>

      </div>

    </div>
  );
};

export default CodingSidebar;