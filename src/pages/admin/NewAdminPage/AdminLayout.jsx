import AdminSidebar from "./components/AdminSidebar";
import SchoolIcon from "@mui/icons-material/School";
import WorkIcon from "@mui/icons-material/Work";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import ArticleIcon from "@mui/icons-material/Article";
import BarChartIcon from "@mui/icons-material/BarChart";
import TerminalIcon from "@mui/icons-material/Terminal";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { findTitleFromMenu } from "../../../utils/helper";
import { useAdminLogout } from "../../../services/authServices";

const menuConfig = [
  {
    key: "submissions-dashboard",
    label: "Submissions",
    icon: <BarChartIcon />,
    type: "A",
    to: "/admin/submissions-dashboard",
  },

  {
    key: "tutorials",
    label: "Tutorials",
    icon: <SchoolIcon />,
    children: [
      { key: "tutorial-add", label: "Add", to: "/admin/tutorials/add" },
      { key: "tutorial-list", label: "List", to: "/admin/tutorials/list" },
      // { key: "tutorial-edit", label: "Edit", to: "/admin/tutorial/edit" },
    ],
  },
  {
    key: "projects",
    label: "Projects",
    icon: <WorkIcon />,
    children: [
      { key: "projects-add", label: "Add", to: "/admin/projects/add" },
      { key: "projects-list", label: "List", to: "/admin/projects/list" },
      // { key: "projects-edit", label: "Edit", to: "/admin/projects/edit" },
    ],
  },
  {
    key: "interviews",
    label: "Interviews",
    icon: <QuestionAnswerIcon />,
    children: [
      { key: "interviews-add", label: "Add", to: "/admin/interviews/add" },
      { key: "interviews-list", label: "List", to: "/admin/interviews/list" },
      // { key: "interviews-edit", label: "Edit", to: "/admin/interviews/edit" },
    ],
  },
  {
    key: "blogs",
    label: "Blogs",
    icon: <ArticleIcon />,
    children: [
      { key: "blogs-add", label: "Add", to: "/admin/blogs/add" },
      { key: "blogs-list", label: "List", to: "/admin/blogs/list" },
      // { key: "blogs-edit", label: "Edit", to: "/admin/blogs/edit" },
    ],
  },
  {
    key: "coding-questions",
    label: "Coding Questions",
    icon: <TerminalIcon />,
    children: [
      { key: "cq-add", label: "Add", to: "/admin/coding-questions/add" },
      { key: "cq-list", label: "List", to: "/admin/coding-questions/list" },
    ],
  },
];

export default function AdminLayout({ onLogout }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const location = useLocation();
  const pageTitle = findTitleFromMenu(menuConfig, location.pathname);
  const adminLogout = useAdminLogout();

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

  return (
    <div className="d-flex">
      <AdminSidebar
        menuConfig={menuConfig}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <div
        style={{
          width: "100%",
          paddingLeft: isSidebarOpen ? "280px" : "60px",
          transition: "padding-left 0.3s ease-in-out",
          minHeight: "100vh",
        }}
      >
        {/* TOP BAR */}
        <div
          className="d-flex align-items-center justify-content-between px-3"
          style={{
            height: "56px",
            background: "#fff",
            borderBottom: "1px solid #e5e5e5",
            position: "sticky",
            top: 0,
            zIndex: 99,
          }}
        >
          <div className="d-flex align-items-center gap-2">
            <MenuIcon
              style={{ cursor: "pointer" }}
              onClick={() => setIsSidebarOpen((p) => !p)}
            />
            <strong>/ {pageTitle}</strong>
          </div>

          <div className="d-flex align-items-center gap-2">
            <div className="d-flex gap-1 gap-lg-2 align-items-center">
              <p className="author-name mb-0  fw-semibold">PrepHQ-Admin</p>
              <img
                className="rounded-circle avatar"
                style={{
                  width: "35px",
                  height: "35px",
                  objectFit: "cover",
                }}
                src="/logos/PrepHQ-03.png"
                alt="Logo"
              />
            </div>

            <button
              className="btn btn-sm btn-outline-danger ms-2"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>

        {/*  PAGE CONTENT */}
        <div className="p-3 pt-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
