import React from "react";
import { Link } from "react-router-dom";
import SchoolIcon from "@mui/icons-material/School";
import WorkIcon from "@mui/icons-material/Work";
import ArticleIcon from "@mui/icons-material/Article";
import BarChartIcon from "@mui/icons-material/BarChart";
import TerminalIcon from "@mui/icons-material/Terminal";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import ScheduleIcon from "@mui/icons-material/Schedule";

import { useTutorialList } from "../../../../services/tutorialServices";
import { useProjectList } from "../../../../services/projectsServices";
import { useBlogList } from "../../../../services/blogServices";
import { useInterviewList } from "../../../../services/interviewsServices";
import {
  useCodingQuestionList,
  useAdminSubmissions,
} from "../../../../services/codingQuestionsServices";

export default function AdminDashboard() {
  const { data: tutorials = [], isLoading: tLoading } = useTutorialList();
  const { data: projects = [], isLoading: pLoading } = useProjectList();
  const { data: blogs = [], isLoading: bLoading } = useBlogList();
  const { data: interviews = [], isLoading: iLoading } = useInterviewList();
  const { data: codingQuestions = [], isLoading: qLoading } = useCodingQuestionList();
  const { data: submissions = [], isLoading: sLoading } = useAdminSubmissions();

  // Latest 5 submissions
  const recentSubmissions = Array.isArray(submissions)
    ? submissions.slice(0, 5)
    : [];

  // Recent content items (latest tutorials + projects combined)
  const recentContent = [
    ...tutorials.slice(0, 3).map((item) => ({ ...item, contentType: "Tutorial", editUrl: `/admin/tutorials/edit/${item.ID}` })),
    ...projects.slice(0, 3).map((item) => ({ ...item, contentType: "Project", editUrl: `/admin/projects/edit/${item.ID}` })),
  ].slice(0, 5);

  const metrics = [
    {
      title: "Total Tutorials",
      value: tLoading ? "..." : tutorials.length,
      label: "Published Tutorials",
      to: "/admin/tutorials/list",
      icon: <SchoolIcon />,
      color: "#35B779",
      bgColor: "#E8F7F0",
    },
    {
      title: "Total Projects",
      value: pLoading ? "..." : projects.length,
      label: "Platform Projects",
      to: "/admin/projects/list",
      icon: <WorkIcon />,
      color: "#0B4565",
      bgColor: "#EBF3F7",
    },
    {
      title: "Total Blog Posts",
      value: bLoading ? "..." : blogs.length,
      label: "Articles & Guides",
      to: "/admin/blogs/list",
      icon: <ArticleIcon />,
      color: "#9333EA",
      bgColor: "#F3E8FF",
    },
    {
      title: "Code Submissions",
      value: sLoading ? "..." : submissions.length,
      label: "PrepCode Submissions",
      to: "/admin/submissions-dashboard",
      icon: <BarChartIcon />,
      color: "#D97706",
      bgColor: "#FEF3C7",
    },
    {
      title: "Coding Questions",
      value: qLoading ? "..." : codingQuestions.length,
      label: "Practice Problems",
      to: "/admin/coding-questions/list",
      icon: <TerminalIcon />,
      color: "#0284C7",
      bgColor: "#E0F2FE",
    },
  ];

  return (
    <div style={{ maxWidth: "1380px", margin: "0 auto" }}>
      {/* ── Welcome Header ── */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard Overview</h1>
          <p className="admin-page-desc">
            Welcome back! Here is an overview of active learning content and student submissions.
          </p>
        </div>

        {/* Quick Create Buttons */}
        <div className="d-flex align-items-center flex-wrap gap-2">
          <Link
            to="/admin/tutorials/add"
            className="btn btn-sm text-white d-inline-flex align-items-center gap-1"
            style={{
              backgroundColor: "var(--admin-primary, #0B4565)",
              borderRadius: "8px",
              padding: "8px 14px",
              fontWeight: 600,
              fontSize: "13px",
            }}
          >
            <AddIcon sx={{ fontSize: 16 }} />
            <span>Add Tutorial</span>
          </Link>

          <Link
            to="/admin/projects/add"
            className="btn btn-sm d-inline-flex align-items-center gap-1"
            style={{
              backgroundColor: "#FFFFFF",
              color: "var(--admin-primary, #0B4565)",
              border: "1px solid var(--admin-border, #E2E8F0)",
              borderRadius: "8px",
              padding: "8px 14px",
              fontWeight: 600,
              fontSize: "13px",
            }}
          >
            <AddIcon sx={{ fontSize: 16 }} />
            <span>Add Project</span>
          </Link>
        </div>
      </div>

      {/* ── Summary Metric Cards Grid ── */}
      <div className="admin-metric-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        {metrics.map((m, idx) => (
          <Link to={m.to} key={idx} className="admin-metric-card">
            <div
              className="admin-metric-icon-box"
              style={{ backgroundColor: m.bgColor, color: m.color }}
            >
              {m.icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="admin-metric-val">{m.value}</div>
              <div className="admin-metric-lbl">{m.title}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Lower Panels: Recent Submissions & Recent Content ── */}
      <div className="row g-4">
        {/* Panel 1: Recent Submissions */}
        <div className="col-12 col-xl-7">
          <div className="admin-card h-100">
            <div className="admin-card-header">
              <div>
                <h3 className="admin-card-title">Recent Submissions</h3>
                <div style={{ fontSize: "12px", color: "var(--admin-text-secondary)" }}>
                  Latest code evaluations from the PrepCode workspace.
                </div>
              </div>
              <Link
                to="/admin/submissions-dashboard"
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "var(--admin-accent, #35B779)",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <span>View All</span>
                <ArrowForwardIcon sx={{ fontSize: 15 }} />
              </Link>
            </div>

            <div className="admin-card-body p-0">
              {sLoading ? (
                <div className="p-4 text-center text-muted" style={{ fontSize: "13px" }}>
                  Loading recent submissions...
                </div>
              ) : recentSubmissions.length === 0 ? (
                <div className="p-4 text-center text-muted" style={{ fontSize: "13px" }}>
                  No recent submissions found.
                </div>
              ) : (
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Question</th>
                        <th>Lang</th>
                        <th>Status</th>
                        <th>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentSubmissions.map((sub, index) => {
                        const isAccepted = sub?.status?.toUpperCase() === "ACCEPTED";
                        return (
                          <tr key={sub?.id || index}>
                            <td style={{ fontWeight: 600 }}>
                              {sub?.user?.name || sub?.user?.username || "Student"}
                            </td>
                            <td style={{ maxWidth: 200, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {sub?.question?.title || sub?.question_title || "Coding Problem"}
                            </td>
                            <td>
                              <span
                                style={{
                                  fontSize: "11px",
                                  fontWeight: 600,
                                  textTransform: "uppercase",
                                  padding: "3px 8px",
                                  borderRadius: "6px",
                                  backgroundColor: "#F1F5F9",
                                  color: "#475569",
                                }}
                              >
                                {sub?.language || "C++"}
                              </span>
                            </td>
                            <td>
                              <span
                                className={`admin-status-chip ${isAccepted ? "success" : "warning"}`}
                              >
                                {isAccepted ? (
                                  <CheckCircleOutlineIcon sx={{ fontSize: 14 }} />
                                ) : (
                                  <CancelOutlinedIcon sx={{ fontSize: 14 }} />
                                )}
                                <span>{sub?.status || "Evaluated"}</span>
                              </span>
                            </td>
                            <td style={{ fontSize: "12px", color: "var(--admin-text-secondary)" }}>
                              {sub?.created_at
                                ? new Date(sub.created_at).toLocaleDateString()
                                : "Recent"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Panel 2: Quick Links & Recent Content */}
        <div className="col-12 col-xl-5">
          <div className="admin-card h-100">
            <div className="admin-card-header">
              <div>
                <h3 className="admin-card-title">Recent Publications</h3>
                <div style={{ fontSize: "12px", color: "var(--admin-text-secondary)" }}>
                  Recently published tutorials and projects.
                </div>
              </div>
            </div>

            <div className="admin-card-body p-0">
              {recentContent.length === 0 ? (
                <div className="p-4 text-center text-muted" style={{ fontSize: "13px" }}>
                  No published content found.
                </div>
              ) : (
                <div className="p-3 d-flex flex-column gap-2">
                  {recentContent.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: "12px 14px",
                        borderRadius: "10px",
                        border: "1px solid var(--admin-border, #E2E8F0)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        backgroundColor: "#FFFFFF",
                        transition: "border-color 0.2s ease",
                      }}
                    >
                      <div style={{ minWidth: 0, flex: 1, paddingRight: 10 }}>
                        <div
                          style={{
                            fontSize: "13.5px",
                            fontWeight: 600,
                            color: "var(--admin-text)",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item.post_title || "Untitled Post"}
                        </div>
                        <div className="d-flex align-items-center gap-2 mt-1">
                          <span
                            style={{
                              fontSize: "11px",
                              fontWeight: 600,
                              color:
                                item.contentType === "Tutorial"
                                  ? "var(--admin-accent, #35B779)"
                                  : "var(--admin-primary, #0B4565)",
                            }}
                          >
                            ● {item.contentType}
                          </span>
                          <span style={{ fontSize: "11.5px", color: "var(--admin-text-secondary)" }}>
                            {item.category_name || "General"}
                          </span>
                        </div>
                      </div>

                      <Link
                        to={item.editUrl}
                        className="btn btn-sm"
                        style={{
                          fontSize: "12px",
                          fontWeight: 500,
                          backgroundColor: "#F8FAFC",
                          border: "1px solid var(--admin-border, #E2E8F0)",
                          borderRadius: "6px",
                          padding: "4px 10px",
                          color: "var(--admin-text)",
                        }}
                      >
                        Edit
                      </Link>
                    </div>
                  ))}
                </div>
              )}

              {/* Quick Actions Footer */}
              <div
                style={{
                  padding: "16px 20px",
                  borderTop: "1px solid var(--admin-border, #E2E8F0)",
                  backgroundColor: "#F8FAFC",
                }}
              >
                <div style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--admin-text)", marginBottom: 10 }}>
                  Quick Shortcuts
                </div>
                <div className="d-flex flex-wrap gap-2">
                  <Link
                    to="/admin/tutorials/list"
                    className="btn btn-sm btn-light border"
                    style={{ fontSize: "12px", borderRadius: "8px" }}
                  >
                    All Tutorials ({tutorials.length})
                  </Link>
                  <Link
                    to="/admin/projects/list"
                    className="btn btn-sm btn-light border"
                    style={{ fontSize: "12px", borderRadius: "8px" }}
                  >
                    All Projects ({projects.length})
                  </Link>
                  <Link
                    to="/admin/blogs/list"
                    className="btn btn-sm btn-light border"
                    style={{ fontSize: "12px", borderRadius: "8px" }}
                  >
                    All Blogs ({blogs.length})
                  </Link>
                  <Link
                    to="/admin/coding-questions/add"
                    className="btn btn-sm btn-light border"
                    style={{ fontSize: "12px", borderRadius: "8px" }}
                  >
                    + Question
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}