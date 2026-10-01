import React, { useState } from "react";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import { FiShare2, FiStar } from "react-icons/fi";
import { FaRegComment } from "react-icons/fa";

// const TABS = ["Description", "Solutions", "Submissions"];
const TABS = ["Description",];

const ProblemDescription = ({ problem }) => {
  const [activeTab, setActiveTab] = useState("Description");
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const difficultyClass = {
    Easy: "badge-easy",
    Medium: "badge-medium",
    Hard: "badge-hard",
  }[problem.difficulty];

  return (
    <div className="prob-panel">
      {/* TABS */}
      <div className="prob-tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`prob-tab ${activeTab === tab ? "prob-tab-active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div className="prob-content">
        {activeTab === "Description" && (
          <>
            {/* Title */}
            <h4 className="prob-title">
              {problem.id}. {problem.title}
            </h4>

            {/* Badges */}
            <div className="prob-meta">
              <span className={`prob-difficulty ${difficultyClass}`}>
                {problem.difficulty}
              </span>
              {problem.topics.map((tag) => (
                <span key={tag} className="prob-tag">{tag}</span>
              ))}
            </div>

            {/* Description */}
            <div
              className="prob-description"
              dangerouslySetInnerHTML={{ __html: problem.description.replace(/\n/g, "<br/>") }}
            />

            {/* Examples */}
            {problem.examples.map((ex) => (
              <div key={ex.id} className="prob-example">
                <p className="prob-example-title">Example {ex.id}:</p>
                <div className="prob-example-block">
                  <div><span className="prob-label">Input:</span> {ex.input}</div>
                  <div><span className="prob-label">Output:</span> {ex.output}</div>
                  {ex.explanation && (
                    <div><span className="prob-label">Explanation:</span> {ex.explanation}</div>
                  )}
                </div>
              </div>
            ))}

            {/* Constraints */}
            <div className="prob-constraints">
              <p className="prob-section-title">Constraints:</p>
              <ul>
                {problem.constraints.map((c, i) => (
                  <li key={i} dangerouslySetInnerHTML={{ __html: c }} />
                ))}
              </ul>
            </div>
          </>
        )}

        {activeTab === "Solutions" && (
          <div className="prob-placeholder">
            <p>Solutions will appear here.</p>
          </div>
        )}

        {activeTab === "Submissions" && (
          <div className="prob-placeholder">
            <p>Your submissions will appear here.</p>
          </div>
        )}
      </div>

      {/* FOOTER */}
      {/* <div className="prob-footer">
        <div className="prob-footer-left">
          <button
            className={`prob-action-btn ${liked ? "active" : ""}`}
            onClick={() => { setLiked(!liked); if (disliked) setDisliked(false); }}
          >
            <AiOutlineLike size={16} />
            <span>{problem.likes + (liked ? 1 : 0)}</span>
          </button>
          <button
            className={`prob-action-btn ${disliked ? "active" : ""}`}
            onClick={() => { setDisliked(!disliked); if (liked) setLiked(false); }}
          >
            <AiOutlineDislike size={16} />
            <span>{problem.dislikes + (disliked ? 1 : 0)}</span>
          </button>
          <button className="prob-action-btn">
            <FaRegComment size={15} />
            <span>{problem.comments}</span>
          </button>
        </div>
        <div className="prob-footer-right">
          <button className="prob-action-btn"><FiStar size={15} /></button>
          <button className="prob-action-btn"><FiShare2 size={15} /></button>
        </div>
      </div> */}
    </div>
  );
};

export default ProblemDescription;