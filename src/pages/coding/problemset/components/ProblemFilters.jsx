// src/pages/coding/problemset/components/ProblemFilters.jsx

import React from "react";
import { FaSearch } from "react-icons/fa";

const ProblemFilters = ({
  search,
  setSearch,
}) => {
  return (
    <div className="problem-filters-container">

      <div className="search-box">

        <FaSearch className="search-icon" />

        <input
          type="text"
          placeholder="Search problems..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-control search-input"
        />

      </div>

    </div>
  );
};

export default ProblemFilters;