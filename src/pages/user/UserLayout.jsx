import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EditIcon from "@mui/icons-material/Edit";
import CodeIcon from "@mui/icons-material/Code";
import UserSidebar from "./components/UserSidebar";
import { findTitleFromMenu } from "../../utils/helper";
import { useUserLogout } from "../../services/authServices";
import { useUserProfile } from "../../services/userServices";

const menuConfig = [
  {
    key: "user-profile",
    label: "User Profile",
    icon: <AccountCircleIcon />,
    to: "/user/profile",
    children: [
      {
        key: "profile-update",
        label: "Update Profile",
        icon: <EditIcon />,
        to: "/user/profile/edit",
      },
    ],
  },
  {
    key: "prepcode-profile",
    label: "PrepCode Profile",
    icon: <CodeIcon />,
    to: "/user/prepcode-profile",
    type: "A",
  },
];

export default function UserLayout() {
 const {data: userData , isLoading , isError } = useUserProfile();

 useEffect(() => {
  console.log(userData?.profile_image_url , "userData");
 },[userData]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const pageTitle = findTitleFromMenu(menuConfig, location.pathname, "User Dashboard");
  const logout = useUserLogout();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch {
      // proceed with client-side logout even if API fails
    } finally {
      setIsLoggingOut(false);
      navigate("/");
    }
  };

  return (
    <div className="d-flex">
      <UserSidebar
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
        {/* Top Bar */}
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
            <p className="mb-0 fw-semibold">My Dashboard</p>
            <img
              className="rounded-circle"
              style={{ width: "35px", height: "35px", objectFit: "cover" }}
               src={userData?.profile_image_url || "/logos/PrepHQ-03.png"}
              alt="Logo"
            />
            <button
              className="btn btn-sm btn-outline-danger ms-2"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-3 pt-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
