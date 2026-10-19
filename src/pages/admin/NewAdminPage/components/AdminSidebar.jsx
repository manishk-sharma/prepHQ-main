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
import { Link, useLocation } from "react-router-dom";
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

  // Route matching helper: returns true ONLY if the target route is currently active
  const isRouteActive = React.useCallback(
    (targetPath) => {
      if (!targetPath) return false;
      const current = location.pathname.replace(/\/+$/, "") || "/";
      const target = targetPath.replace(/\/+$/, "") || "/";

      // Dashboard special handling: match ONLY /admin or /admin/dashboard
      if (target === "/admin") {
        return current === "/admin" || current === "/admin/dashboard";
      }

      // Exact match or sub-path match (e.g. /admin/projects/details matches /admin/projects/details/customer-churn)
      return current === target || current.startsWith(`${target}/`);
    },
    [location.pathname]
  );

  // Parent active detection: returns true if any child route is active or matches the section prefix
  const isParentActive = React.useCallback(
    (menu) => {
      if (!menu.children) return false;
      const childMatch = menu.children.some((child) => isRouteActive(child.to));
      if (childMatch) return true;

      const current = location.pathname.replace(/\/+$/, "");
      if (menu.key && current.startsWith(`/admin/${menu.key}`)) {
        return true;
      }
      return false;
    },
    [isRouteActive, location.pathname]
  );

  // Initialize and synchronize openMenus with active section
  const [openMenus, setOpenMenus] = React.useState(() => {
    const initial = {};
    if (typeof window !== "undefined") {
      const current = window.location.pathname.replace(/\/+$/, "");
      menuConfig?.forEach((item) => {
        if (item.children) {
          const matchesChild = item.children.some(
            (c) => current === c.to || current.startsWith(`${c.to}/`)
          );
          const matchesParent = item.key && current.startsWith(`/admin/${item.key}`);
          if (matchesChild || matchesParent) {
            initial[item.key] = true;
          }
        }
      });
    }
    return initial;
  });

  // Automatically keep parent menu open if current path is in children or matches section
  React.useEffect(() => {
    menuConfig?.forEach((item) => {
      if (item.children && isParentActive(item)) {
        setOpenMenus((prev) => ({ ...prev, [item.key]: true }));
      }
    });
  }, [isParentActive, menuConfig]);

  const isCompact = !isSidebarOpen && !isMobile;
  const sidebarWidth = isMobile ? 280 : isSidebarOpen ? 260 : 72;

  const handleToggleMenu = (key) => {
    if (isCompact) {
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

  return (
    <nav
      {...props}
      className={`admin-sidebar-nav ${className} ${
        isMobile && isSidebarOpen ? "mobile-open" : ""
      } ${isCompact ? "compact" : ""}`}
      style={{
        width: sidebarWidth,
        overflow: "hidden",
      }}
      aria-label="Admin Navigation"
    >
      {/* ── Top Header Brand ── */}
      <div className="admin-sidebar-header">
        {!isCompact && (
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
              const isActive = isRouteActive(menu.to);

              const navButton = (
                <ListItemButton
                  component={Link}
                  to={menu.to}
                  onClick={handleItemClick}
                  className={`admin-nav-item ${isActive ? "active" : ""}`}
                >
                  <ListItemIcon className="admin-nav-icon">
                    {menu.icon}
                  </ListItemIcon>

                  {!isCompact && (
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
                  {isCompact ? (
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
            const hasActiveChild = isParentActive(menu);
            // In compact (collapsed) mode, highlight the parent icon if a child is active
            const isParentHighlighted = isCompact && hasActiveChild;

            const parentButton = (
              <ListItemButton
                onClick={() => handleToggleMenu(menu.key)}
                className={`admin-nav-item ${isParentHighlighted ? "active" : ""}`}
              >
                <ListItemIcon className="admin-nav-icon">
                  {menu.icon}
                </ListItemIcon>

                {!isCompact && (
                  <>
                    <ListItemText
                      primary={menu.label}
                      primaryTypographyProps={{
                        className: "admin-nav-label",
                      }}
                    />
                    <span className="admin-nav-arrow">
                      {isMenuOpen ? (
                        <ExpandLess sx={{ fontSize: 18 }} />
                      ) : (
                        <ExpandMore sx={{ fontSize: 18 }} />
                      )}
                    </span>
                  </>
                )}
              </ListItemButton>
            );

            return (
              <li key={menu.key} style={{ listStyle: "none" }}>
                {isCompact ? (
                  <Tooltip title={menu.label} placement="right" arrow>
                    {parentButton}
                  </Tooltip>
                ) : (
                  parentButton
                )}

                {!isCompact && (
                  <Collapse in={isMenuOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding className="admin-submenu-list">
                      {menu.children.map((child) => {
                        const isChildActive = isRouteActive(child.to);
                        return (
                          <ListItemButton
                            key={child.key}
                            component={Link}
                            to={child.to}
                            onClick={handleItemClick}
                            className={`admin-subnav-item ${isChildActive ? "active" : ""}`}
                          >
                            <ListItemIcon
                              className="admin-subnav-icon"
                              sx={{
                                minWidth: 20,
                                color: isChildActive
                                  ? "var(--admin-accent)"
                                  : "rgba(255, 255, 255, 0.6)",
                              }}
                            >
                              {child.icon || getSubmenuIcon(child.label)}
                            </ListItemIcon>
                            <ListItemText
                              primary={child.label}
                              primaryTypographyProps={{
                                className: "admin-subnav-label",
                                fontSize: "13px",
                                fontWeight: isChildActive ? 600 : 400,
                              }}
                            />
                            {isChildActive && (
                              <span className="admin-subnav-indicator" />
                            )}
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
      <div className="admin-sidebar-footer">
        {!isCompact ? (
          <>
            <span className="admin-sidebar-version">PrepHQ v2.0</span>
            <span className="admin-sidebar-status">
              <span className="admin-status-pulse" />
              <span>Online</span>
            </span>
          </>
        ) : (
          <Tooltip title="PrepHQ v2.0 · Online" placement="right" arrow>
            <span className="admin-compact-status">
              <span className="admin-status-pulse" />
            </span>
          </Tooltip>
        )}
      </div>
    </nav>
  );
}
