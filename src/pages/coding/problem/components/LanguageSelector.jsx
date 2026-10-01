// src/pages/coding/problem/components/LanguageSelector.jsx

import React from "react";

const LanguageSelector = ({
  language,
  setLanguage,
}) => {
  const languages = [
    "javascript",
    "python",
    "java",
    "cpp",
  ];

  return (
    <div className="language-selector-wrapper">

      <select
        className="form-select language-select"
        value={language}
        onChange={(e) =>
          setLanguage(e.target.value)
        }
      >
        {languages.map((lang) => (
          <option key={lang} value={lang}>
            {lang.toUpperCase()}
          </option>
        ))}
      </select>

    </div>
  );
};

export default LanguageSelector;