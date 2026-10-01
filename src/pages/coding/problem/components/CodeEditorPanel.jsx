import React from "react";
import Editor from "@monaco-editor/react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { VscCode } from "react-icons/vsc";
import { TbCode } from "react-icons/tb";
import { MdOutlineFullscreen, MdOutlineFullscreenExit } from "react-icons/md";
import { LuUndo2, LuRedo2 } from "react-icons/lu";
import { FaJava } from "react-icons/fa";
import {
  SiJavascript,
  SiTypescript,
  SiPython,
  SiCplusplus,
  SiC,
  SiGo,
  SiRust,
  SiKotlin,
  SiSwift,
  SiRuby,
  SiPhp,
} from "react-icons/si";

const LANG_ICONS = {
  javascript:  SiJavascript,
  typescript:  SiTypescript,
  python:      SiPython,
  java:        FaJava,
  "c++":       SiCplusplus,
  cpp:         SiCplusplus,
  c:           SiC,
  go:          SiGo,
  golang:      SiGo,
  rust:        SiRust,
  kotlin:      SiKotlin,
  swift:       SiSwift,
  ruby:        SiRuby,
  php:         SiPhp,
};

const getLangIcon = (lang) => LANG_ICONS[lang?.toLowerCase()] ?? TbCode;

const CodeEditorPanel = ({
  starterCode,
  language,
  code,
  onLanguageChange,
  onCodeChange,
  isFullscreen,
  onToggleFullscreen,
  theme = "light",
}) => {
  const isDark = theme === "dark";

  const handleLangChange = (lang) => {
    onLanguageChange?.(lang);
  };

  return (
    <div className="editor-panel">
      {/* TOPBAR */}
      <div className="editor-topbar">
        <div className="editor-topbar-left">
          <VscCode size={16} className="editor-code-icon" />
          <span className="editor-topbar-label">Code</span>
        </div>
      </div>

      {/* LANG BAR */}
      <div className="editor-langbar">
        <div className="editor-langbar-left">
          <Select
            value={language}
            onChange={(e) => handleLangChange(e.target.value)}
            size="small"
            renderValue={(val) => {
              const Icon = getLangIcon(val);
              return (
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Icon size={14} style={{ color: isDark ? "#37AB79" : "#074568", flexShrink: 0 }} />
                  {val.charAt(0).toUpperCase() + val.slice(1)}
                </span>
              );
            }}
            sx={{
              height: 32,
              fontSize: "0.78rem",
              fontWeight: 600,
              color: isDark ? "#e5e7eb" : "#074568",
              background: isDark ? "#2d2d2d" : "#ffffff",
              borderRadius: "6px",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: isDark ? "#3a3a3a" : "rgba(7,69,104,0.25)",
                borderWidth: "1.5px",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#37AB79",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#37AB79",
                borderWidth: "1.5px",
              },
              "& .MuiSelect-icon": {
                color: isDark ? "#9ca3af" : "#074568",
              },
              "& .MuiSelect-select": {
                paddingLeft: "4px",
                paddingTop: "6px",
                paddingBottom: "6px",
              },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  bgcolor: isDark ? "#252526" : "#ffffff",
                  border: `1px solid ${isDark ? "#3a3a3a" : "rgba(7,69,104,0.15)"}`,
                  borderRadius: "8px",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                  mt: 0.5,
                },
              },
            }}
          >
            {Object.keys(starterCode).map((lang) => {
              const Icon = getLangIcon(lang);
              return (
                <MenuItem
                  key={lang}
                  value={lang}
                  sx={{
                    fontSize: "0.78rem",
                    fontWeight: 500,
                    color: isDark ? "#e5e7eb" : "#074568",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    "&:hover": {
                      bgcolor: isDark ? "rgba(55,171,121,0.12)" : "#E6FFF4",
                    },
                    "&.Mui-selected": {
                      bgcolor: isDark ? "rgba(55,171,121,0.18)" : "#E6FFF4",
                      color: isDark ? "#37AB79" : "#074568",
                      fontWeight: 700,
                    },
                    "&.Mui-selected:hover": {
                      bgcolor: isDark ? "rgba(55,171,121,0.25)" : "#d1fae5",
                    },
                  }}
                >
                  <Icon size={14} />
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </MenuItem>
              );
            })}
          </Select>
          <span className="editor-autosave">• Auto</span>
        </div>
        <div className="editor-langbar-right">
          {/* <button className="editor-icon-btn" title="Undo"><LuUndo2 size={15} /></button>
          <button className="editor-icon-btn" title="Redo"><LuRedo2 size={15} /></button> */}
         <button
            className="editor-icon-btn"
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            onClick={onToggleFullscreen}
          >
            {isFullscreen
              ? <MdOutlineFullscreenExit size={17} />
              : <MdOutlineFullscreen size={17} />
            }
          </button>
        </div>
      </div>

      {/* MONACO */}
      <div className="editor-container">
        <Editor
          height="100%"
          theme={theme === "dark" ? "prephq-dark" : "prephq-light"}
          language={language}
          value={code}
          onChange={(val) => onCodeChange?.(val ?? "")}
          beforeMount={(monaco) => {
            monaco.editor.defineTheme("prephq-light", {
              base: "vs",
              inherit: true,
              rules: [],
              colors: {
                "editor.background":                   "#ffffff",
                "editor.foreground":                   "#1f2937",
                "editor.lineHighlightBackground":      "#E6FFF4",
                "editor.selectionBackground":          "#c3f0da",
                "editor.selectionHighlightBackground": "#d1fae5",
                "editorLineNumber.foreground":         "#9ca3af",
                "editorLineNumber.activeForeground":   "#074568",
                "editorCursor.foreground":             "#074568",
                "editorIndentGuide.background1":       "#e5e7eb",
                "editorIndentGuide.activeBackground1": "#37AB79",
                "scrollbarSlider.background":          "#37AB7950",
                "scrollbarSlider.hoverBackground":     "#37AB7980",
                "scrollbarSlider.activeBackground":    "#37AB79b0",
                "editorWidget.background":             "#f8fafc",
                "editorWidget.border":                 "#e5e7eb",
                "editorSuggestWidget.background":      "#ffffff",
                "editorSuggestWidget.border":          "#e5e7eb",
                "editorSuggestWidget.selectedBackground": "#E6FFF4",
                "editorGutter.background":             "#f8fafc",
              },
            });

            monaco.editor.defineTheme("prephq-dark", {
              base: "vs-dark",
              inherit: true,
              rules: [],
              colors: {
                "editor.background":                   "#1e1e1e",
                "editor.foreground":                   "#e5e7eb",
                "editor.lineHighlightBackground":      "#37AB7918",
                "editor.selectionBackground":          "#37AB7935",
                "editor.selectionHighlightBackground": "#37AB7920",
                "editorLineNumber.foreground":         "#4b5563",
                "editorLineNumber.activeForeground":   "#37AB79",
                "editorCursor.foreground":             "#37AB79",
                "editorIndentGuide.background1":       "#2d2d2d",
                "editorIndentGuide.activeBackground1": "#37AB79",
                "scrollbarSlider.background":          "#37AB7940",
                "scrollbarSlider.hoverBackground":     "#37AB7960",
                "scrollbarSlider.activeBackground":    "#37AB7980",
                "editorWidget.background":             "#252526",
                "editorWidget.border":                 "#3a3a3a",
                "editorSuggestWidget.background":      "#252526",
                "editorSuggestWidget.border":          "#3a3a3a",
                "editorSuggestWidget.selectedBackground": "#37AB7930",
                "editorGutter.background":             "#1e1e1e",
              },
            });
          }}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            wordWrap: "on",
            lineNumbers: "on",
            renderLineHighlight: "line",
            fontFamily: "'Fira Code', 'Cascadia Code', monospace",
            fontLigatures: true,
            padding: { top: 12 },
          }}
        />
      </div>

      {/* STATUS BAR */}
      {/* <div className="editor-statusbar">
        <span>Saved</span>
        <span>Ln 1, Col 1</span>
      </div> */}
    </div>
  );
};

export default CodeEditorPanel;