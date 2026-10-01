// src/pages/coding/problemset/components/ProblemTable.jsx

import React from "react";
import { useNavigate } from "react-router-dom";

const ProblemTable = ({ problems }) => {
  const navigate = useNavigate();

  const getDifficultyClass = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "difficulty easy";

      case "Medium":
        return "difficulty medium";

      case "Hard":
        return "difficulty hard";

      default:
        return "difficulty";
    }
  };

  return (
    <div className="problem-table-wrapper">

      <table className="table problem-table align-middle">

        <thead>
          <tr>
            <th>Title</th>
            <th>Domain</th>
            <th>Acceptance</th>
            <th>Difficulty</th>
          </tr>
        </thead>

        <tbody>

          {problems.map((problem) => (
            <tr
              key={problem.id}
              className="problem-row"
              onClick={() =>
                navigate(
                  `/coding/problems/${problem.slug}`
                )
              }
            >
              <td>{problem.title}</td>

              <td>
                <span className="domain-badge">
                  {problem.domain}
                </span>
              </td>

              <td>{problem.acceptance}</td>

              <td>
                <span
                  className={getDifficultyClass(
                    problem.difficulty
                  )}
                >
                  {problem.difficulty}
                </span>
              </td>
            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
};

export default ProblemTable;