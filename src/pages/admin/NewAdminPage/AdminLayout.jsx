import React, { useState, useEffect } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import AdminSidebar from "./components/AdminSidebar";
import "./admin.css";

// MUI Icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import SchoolIcon from "@mui/icons-material/School";
import WorkIcon from "@mui/icons-material/Work";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import ArticleIcon from "@mui/icons-material/Article";
import BarChartIcon from "@mui/icons-material/BarChart";
import TerminalIcon from "@mui/icons-material/Terminal";
import QuizIcon from "@mui/icons-material/Quiz";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import LaunchIcon from "@mui/icons-material/Launch";

import { useAdminLogout } from "../../../services/authServices";

const menuConfig = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: <DashboardIcon sx={{ fontSize: 20 }} />,
    type: "A",
    to: "/admin",
  },
  {
    key: "submissions-dashboard",
    label: "Submissions",
    icon: <BarChartIcon sx={{ fontSize: 20 }} />,
    type: "A",
    to: "/admin/submissions-dashboard",
  },
  {
    key: "tutorials",
    label: "Tutorials",
    icon: <SchoolIcon sx={{ fontSize: 20 }} />,
    children: [
      { key: "tutorial-add", label: "Add Tutorial", to: "/admin/tutorials/add" },
      { key: "tutorial-list", label: "All Tutorials", to: "/admin/tutorials/list" },
    ],
  },
  {
    key: "projects",
    label: "Projects",
    icon: <WorkIcon sx={{ fontSize: 20 }} />,
    children: [
      { key: "projects-add", label: "Add Project", to: "/admin/projects/add" },
      { key: "projects-list", label: "All Projects", to: "/admin/projects/list" },
      { key: "projects-details", label: "Project Details Page", to: "/admin/projects/details" },
    ],
  },
  {
    key: "interviews",
    label: "Interviews",
    icon: <QuestionAnswerIcon sx={{ fontSize: 20 }} />,
    children: [
      { key: "interviews-add", label: "Add Interview", to: "/admin/interviews/add" },
      { key: "interviews-list", label: "All Interviews", to: "/admin/interviews/list" },
    ],
  },
  {
    key: "blogs",
    label: "Blogs",
    icon: <ArticleIcon sx={{ fontSize: 20 }} />,
    children: [
      { key: "blogs-add", label: "Add Blog", to: "/admin/blogs/add" },
      { key: "blogs-list", label: "All Blogs", to: "/admin/blogs/list" },
    ],
  },
  {
    key: "assessments",
    label: "Assessments",
    icon: <QuizIcon sx={{ fontSize: 20 }} />,
    type: "A",
    to: "/assessments",
  },
  {
    key: "coding-questions",
    label: "Coding Questions",
    icon: <TerminalIcon sx={{ fontSize: 20 }} />,
    children: [
      { key: "cq-add", label: "Add Question", to: "/admin/coding-questions/add" },
      { key: "cq-list", label: "All Questions", to: "/admin/coding-questions/list" },
    ],
  },
];

export default function AdminLayout({ onLogout }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const location = useLocation();
  const adminLogout = useAdminLogout();

  // Screen size listener for responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await adminLogout();
    } catch {
      // proceed with client-side logout even if API fails
    } finally {
      setIsLoggingOut(false);
      onLogout?.();
    }
  };

  // Build clean breadcrumbs based on pathname
  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path === "/admin" || path === "/admin/dashboard") {
      return { section: "Dashboard", current: "Overview" };
    }
    if (path.includes("/submissions-dashboard")) {
      return { section: "Submissions", current: "Platform Submissions" };
    }
    if (path.includes("/tutorials/add")) {
      return { section: "Tutorials", current: "Add Tutorial" };
    }
    if (path.includes("/tutorials/list")) {
      return { section: "Tutorials", current: "All Tutorials" };
    }
    if (path.includes("/tutorials/edit")) {
      return { section: "Tutorials", current: "Edit Tutorial" };
    }
    if (path.includes("/projects/add")) {
      return { section: "Projects", current: "Add Project" };
    }
    if (path.includes("/projects/details")) {
      return { section: "Projects", current: "Project Details Editor" };
    }
    if (path.includes("/projects/list")) {
      return { section: "Projects", current: "All Projects" };
    }
    if (path.includes("/projects/edit")) {
      return { section: "Projects", current: "Edit Project" };
    }
    if (path.includes("/interviews/add")) {
      return { section: "Interviews", current: "Add Interview" };
    }
    if (path.includes("/interviews/list")) {
      return { section: "Interviews", current: "All Interviews" };
    }
    if (path.includes("/interviews/edit")) {
      return { section: "Interviews", current: "Edit Interview" };
    }
    if (path.includes("/blogs/add")) {
      return { section: "Blogs", current: "Add Blog" };
    }
    if (path.includes("/blogs/list")) {
      return { section: "Blogs", current: "All Blogs" };
    }
    if (path.includes("/blogs/edit")) {
      return { section: "Blogs", current: "Edit Blog" };
    }
    if (path.includes("/coding-questions/add")) {
      return { section: "Coding Questions", current: "Add Question" };
    }
    if (path.includes("/coding-questions/list")) {
      return { section: "Coding Questions", current: "All Questions" };
    }
    if (path.includes("/coding-questions/edit")) {
      return { section: "Coding Questions", current: "Edit Question" };
    }
    return { section: "Dashboard", current: "Admin Panel" };
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="admin-shell">
      {/* Mobile Backdrop Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="admin-backdrop"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Left Sidebar ── */}
      <AdminSidebar
        menuConfig={menuConfig}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isMobile={isMobile}
        onMobileClose={() => setIsSidebarOpen(false)}
      />

      {/* ── Main Viewport Area ── */}
      <div
        style={{
          width: "100%",
          marginLeft: isMobile ? 0 : isSidebarOpen ? "260px" : "72px",
          transition: "margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        {/* ── Modern Top Navigation Header ── */}
        <header className="admin-topbar">
          <div className="d-flex align-items-center gap-3">
            <button
              type="button"
              className="admin-action-btn"
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              aria-label="Toggle sidebar"
            >
              <MenuIcon sx={{ fontSize: 20 }} />
            </button>

            {/* Breadcrumb Navigation */}
            <div className="admin-breadcrumbs">
              <Link to="/admin" className="admin-breadcrumb-root">
                Dashboard
              </Link>
              {breadcrumbs.section !== "Dashboard" && (
                <>
                  <span className="admin-breadcrumb-sep">/</span>
                  <span style={{ color: "var(--admin-text-secondary)" }}>
                    {breadcrumbs.section}
                  </span>
                </>
              )}
              <span className="admin-breadcrumb-sep">/</span>
              <span className="admin-breadcrumb-current">
                {breadcrumbs.current}
              </span>
            </div>
          </div>

          {/* Right Section Actions & Profile */}
          <div className="d-flex align-items-center gap-2 gap-sm-3">
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="admin-view-site-btn d-none d-md-inline-flex"
              title="Open public website in new tab"
            >
              <LaunchIcon sx={{ fontSize: 16 }} />
              <span>View Website</span>
            </Link>

            {/* Profile Avatar Badge */}
            <div className="admin-profile-badge">
              <div className="admin-avatar-wrap">
                <img
                  className="admin-avatar-img"
                  src="/logos/PrepHQ-03.png"
                  alt="Admin Avatar"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://prephq.theiotacademy.co/assets/logo-v0Km-bSu.svg";
                  }}
                />
                <span className="admin-online-dot" />
              </div>
              <div className="d-none d-sm-block text-start">
                <div style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--admin-text)", lineHeight: 1.2 }}>
                  PrepHQ-Admin
                </div>
                <div style={{ fontSize: "11px", color: "var(--admin-text-secondary)" }}>
                  Administrator
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              type="button"
              className="admin-logout-btn"
              onClick={handleLogout}
              disabled={isLoggingOut}
              title="Sign out of admin session"
            >
              <LogoutIcon sx={{ fontSize: 16 }} />
              <span className="d-none d-sm-inline">
                {isLoggingOut ? "Signing out..." : "Logout"}
              </span>
            </button>
          </div>
        </header>

        {/* ── Main Page Content ── */}
        <main className="admin-content-wrap">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
