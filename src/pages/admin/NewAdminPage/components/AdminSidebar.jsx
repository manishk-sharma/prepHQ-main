import * as React from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Collapse from "@mui/material/Collapse";
import Tooltip from "@mui/material/Tooltip";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import ListIcon from "@mui/icons-material/List";
import EditIcon from "@mui/icons-material/Edit";
import { Link, NavLink, useLocation } from "react-router-dom";
import { LuPanelLeftClose, LuPanelRightClose, LuChevronRight } from "react-icons/lu";

export default function AdminSidebar({
  className = "",
  menuConfig,
  isSidebarOpen,
  setIsSidebarOpen,
  isMobile,
  onMobileClose,
  ...props
}) {
  const location = useLocation();
  const [openMenus, setOpenMenus] = React.useState({});

  // Automatically keep parent menu open if current path is in children
  React.useEffect(() => {
    menuConfig?.forEach((item) => {
      if (item.children) {
        const hasActiveChild = item.children.some((child) =>
          location.pathname.startsWith(child.to)
        );
        if (hasActiveChild) {
          setOpenMenus((prev) => ({ ...prev, [item.key]: true }));
        }
      }
    });
  }, [location.pathname, menuConfig]);

  const handleToggleMenu = (key) => {
    if (!isSidebarOpen && !isMobile) {
      setIsSidebarOpen(true);
      setOpenMenus((prev) => ({ ...prev, [key]: true }));
      return;
    }
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleItemClick = () => {
    if (isMobile) {
      onMobileClose?.();
    }
  };

  const getSubmenuIcon = (label) => {
    const l = label.toLowerCase();
    if (l.includes("add")) return <AddIcon sx={{ fontSize: 18 }} />;
    if (l.includes("list")) return <ListIcon sx={{ fontSize: 18 }} />;
    if (l.includes("edit")) return <EditIcon sx={{ fontSize: 18 }} />;
    return <LuChevronRight size={14} />;
  };

  const sidebarWidth = isMobile ? 280 : isSidebarOpen ? 260 : 72;

  return (
    <nav
      {...props}
      className={`admin-sidebar-nav ${className} ${
        isMobile && isSidebarOpen ? "mobile-open" : ""
      }`}
      style={{
        width: sidebarWidth,
        overflow: "hidden",
      }}
      aria-label="Admin Navigation"
    >
      {/* ── Top Header Brand ── */}
      <div
        className="admin-sidebar-header"
        style={{
          justifyContent: !isSidebarOpen && !isMobile ? "center" : "space-between",
          padding: !isSidebarOpen && !isMobile ? "0 8px" : "0 18px",
        }}
      >
        {(isSidebarOpen || isMobile) && (
          <Link
            to="/admin"
            className="admin-sidebar-brand"
            onClick={handleItemClick}
            title="PrepHQ Admin Dashboard"
          >
            <img
              src="https://prephq.theiotacademy.co/assets/logo-v0Km-bSu.svg"
              alt="PrepHQ"
              className="admin-sidebar-logo"
            />
          </Link>
        )}

        <button
          type="button"
          className="admin-toggle-btn"
          onClick={() => {
            if (isMobile) {
              onMobileClose?.();
            } else {
              setIsSidebarOpen(!isSidebarOpen);
            }
          }}
          title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isSidebarOpen ? <LuPanelLeftClose size={19} /> : <LuPanelRightClose size={19} />}
        </button>
      </div>

      {/* ── Navigation Links ── */}
      <div className="admin-sidebar-scroll">
        <List component="ul" disablePadding>
          {menuConfig.map((menu) => {
            /* 1. SIMPLE MENU (No children) */
            if (menu.type === "A" || !menu.children) {
              const isActive =
                menu.to === "/admin"
                  ? location.pathname === "/admin" || location.pathname === "/admin/dashboard"
                  : location.pathname.startsWith(menu.to);

              const navButton = (
                <ListItemButton
                  component={NavLink}
                  to={menu.to}
                  onClick={handleItemClick}
                  className={`admin-nav-item ${isActive ? "active" : ""}`}
                  sx={{
                    justifyContent: !isSidebarOpen && !isMobile ? "center" : "flex-start",
                    px: !isSidebarOpen && !isMobile ? 1 : 2,
                  }}
                >
                  <ListItemIcon
                    className="admin-nav-icon"
                    sx={{
                      minWidth: !isSidebarOpen && !isMobile ? "unset" : 38,
                      justifyContent: "center",
                    }}
                  >
                    {menu.icon}
                  </ListItemIcon>

                  {(isSidebarOpen || isMobile) && (
                    <ListItemText
                      primary={menu.label}
                      primaryTypographyProps={{
                        className: "admin-nav-label",
                      }}
                    />
                  )}
                </ListItemButton>
              );

              return (
                <li key={menu.key} style={{ listStyle: "none" }}>
                  {!isSidebarOpen && !isMobile ? (
                    <Tooltip title={menu.label} placement="right" arrow>
                      {navButton}
                    </Tooltip>
                  ) : (
                    navButton
                  )}
                </li>
              );
            }

            /* 2. NESTED MENU (With expandable children) */
            const isMenuOpen = !!openMenus[menu.key];
            const hasActiveChild = menu.children.some((child) =>
              location.pathname.startsWith(child.to)
            );

            const parentButton = (
              <ListItemButton
                onClick={() => handleToggleMenu(menu.key)}
                className={`admin-nav-item ${
                  hasActiveChild && (!isSidebarOpen && !isMobile) ? "active-parent" : ""
                }`}
                sx={{
                  justifyContent: !isSidebarOpen && !isMobile ? "center" : "flex-start",
                  px: !isSidebarOpen && !isMobile ? 1 : 2,
                }}
              >
                <ListItemIcon
                  className="admin-nav-icon"
                  sx={{
                    minWidth: !isSidebarOpen && !isMobile ? "unset" : 38,
                    justifyContent: "center",
                  }}
                >
                  {menu.icon}
                </ListItemIcon>

                {(isSidebarOpen || isMobile) && (
                  <>
                    <ListItemText
                      primary={menu.label}
                      primaryTypographyProps={{
                        className: "admin-nav-label",
                      }}
                    />
                    {isMenuOpen ? (
                      <ExpandLess sx={{ fontSize: 18, color: "rgba(255,255,255,0.7)" }} />
                    ) : (
                      <ExpandMore sx={{ fontSize: 18, color: "rgba(255,255,255,0.7)" }} />
                    )}
                  </>
                )}
              </ListItemButton>
            );

            return (
              <li key={menu.key} style={{ listStyle: "none" }}>
                {!isSidebarOpen && !isMobile ? (
                  <Tooltip title={menu.label} placement="right" arrow>
                    {parentButton}
                  </Tooltip>
                ) : (
                  parentButton
                )}

                {(isSidebarOpen || isMobile) && (
                  <Collapse in={isMenuOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding className="admin-submenu-list">
                      {menu.children.map((child) => {
                        const isChildActive = location.pathname === child.to;
                        return (
                          <ListItemButton
                            key={child.key}
                            component={NavLink}
                            to={child.to}
                            onClick={handleItemClick}
                            className={`admin-subnav-item ${isChildActive ? "active" : ""}`}
                          >
                            <ListItemIcon
                              sx={{
                                minWidth: 24,
                                color: isChildActive
                                  ? "var(--admin-accent)"
                                  : "rgba(255,255,255,0.6)",
                              }}
                            >
                              {child.icon || getSubmenuIcon(child.label)}
                            </ListItemIcon>
                            <ListItemText
                              primary={child.label}
                              primaryTypographyProps={{
                                fontSize: "13px",
                                fontWeight: isChildActive ? 600 : 400,
                              }}
                            />
                          </ListItemButton>
                        );
                      })}
                    </List>
                  </Collapse>
                )}
              </li>
            );
          })}
        </List>
      </div>

      {/* ── Sidebar Footer (Version/Status) ── */}
      {(isSidebarOpen || isMobile) && (
        <div
          style={{
            padding: "12px 18px",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            fontSize: "11px",
            color: "rgba(255,255,255,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span>PrepHQ v2.0</span>
          <span style={{ color: "var(--admin-accent)", fontWeight: 600 }}>● Online</span>
        </div>
      )}
    </nav>
  );
}
