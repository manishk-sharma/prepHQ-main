// src/pages/coding/layout/CodingLayout.jsx

import React from "react";
import { Outlet } from "react-router-dom";
import CodingSidebar from "./CodingSidebar";

import "./CodingLayout.css";

const CodingLayout = () => {
  return (
    // <div className="coding-layout-container">

    //   {/* Sidebar */}
    //   <CodingSidebar />

    //   {/* Main Content */}
    //   <div className="coding-main-content">
    //     <Outlet />
    //   </div>

    // </div>

    <Outlet/>
  );
};

export default CodingLayout;