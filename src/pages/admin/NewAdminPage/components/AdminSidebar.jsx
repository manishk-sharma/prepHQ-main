import * as React from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import { Link, NavLink } from "react-router-dom";

import AddIcon from "@mui/icons-material/Add";
import ListIcon from "@mui/icons-material/List";
import EditIcon from "@mui/icons-material/Edit";

import { LuPanelLeftClose, LuPanelRightClose } from "react-icons/lu";

export default function AdminSidebar({ className, menuConfig, isSidebarOpen, setIsSidebarOpen, ...props }) {
  const [openMenu, setOpenMenu] = React.useState(null);
  

  const handleToggleSidebar = () => {
    setOpenMenu(null);
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleToggle = (key) => {
    setOpenMenu((prev) => (prev === key ? null : key));
  };

  const handleMenuItemClick = () => {
    setIsSidebarOpen(true);
  };

  const getIconByLabel = (label) => {
    if (label.toLowerCase().includes("add")) return <AddIcon />;
    if (label.toLowerCase().includes("list")) return <ListIcon />;
    if (label.toLowerCase().includes("edit")) return <EditIcon />;
    return null;
  };

  return (
    <List
      {...props}
      className={`${className} py-0`}
      sx={{
        width: isSidebarOpen ? 280 : 60,
        overflow: "hidden",
        transition: "width 0.3s ease",
        bgcolor: "#57cc99",
        height: "100vh",
        position: "fixed",
      }}
      component="nav"
    >
      {/* header */}
      <div
        className={`d-flex sidebar-head align-items-center ${
          isSidebarOpen
            ? "px-4 justify-content-between"
            : "px-2  justify-content-center"
        }`}
        style={{ background: "#074568" ,height: "56px"}}
      >
        <Link to="/"> 
          <img
            src="https://prephq.theiotacademy.co/assets/logo-v0Km-bSu.svg"
            className={`${isSidebarOpen ? "d-block" : "d-none"} img-fluid`}
            style={{ maxHeight: "40px" }}
          />
        </Link>

        {isSidebarOpen ? (
          <LuPanelLeftClose
            size={25}
            className="text-white"
            onClick={handleToggleSidebar}
            style={{ cursor: "pointer" }}
          />
        ) : (
          <LuPanelRightClose
            size={25}
            className="text-white"
            onClick={handleToggleSidebar}
            style={{ cursor: "pointer" }}
          />
        )}
      </div>

      {menuConfig.map((menu) => {
        /* ================= SIMPLE MENU ================= */
        if (menu.type === "A") {
          return (
            <ListItemButton
              key={menu.key}
              component={NavLink}
              to={menu.to}
              onClick={handleMenuItemClick}
            >
              <ListItemIcon sx={{ color: "#074568" }}>
                {menu.icon}
              </ListItemIcon>

              {isSidebarOpen && (
                <ListItemText
                  primary={menu.label}
                  primaryTypographyProps={{
                    fontWeight: 700,
                    color: "#074568",
                  }}
                />
              )}
            </ListItemButton>
          );
        }

        /* ================= NESTED MENU ================= */
        return (
          <React.Fragment key={menu.key}>
            <ListItemButton onClick={() => handleToggle(menu.key)}>
              <ListItemIcon sx={{ color: "#074568" }}>
                {menu.icon}
              </ListItemIcon>

              {isSidebarOpen && (
                <>
                  <ListItemText
                    primary={menu.label}
                    primaryTypographyProps={{
                      fontWeight: 700,
                      color: "#074568",
                    }}
                  />

                  {openMenu === menu.key ? (
                    <ExpandLess sx={{ color: "#074568" }} />
                  ) : (
                    <ExpandMore sx={{ color: "#074568" }} />
                  )}
                </>
              )}
            </ListItemButton>

            <Collapse in={openMenu === menu.key} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {menu.children.map((child) => (
                  <ListItemButton
                    key={child.key}
                    component={NavLink}
                    to={child.to}
                    sx={{ pl: 4 }}
                    onClick={handleMenuItemClick}
                  >
                    <ListItemIcon sx={{ color: "#074568" }}>
                      {child.icon || getIconByLabel(child.label)}
                    </ListItemIcon>

                    {isSidebarOpen && (
                      <ListItemText
                        primary={child.label}
                        primaryTypographyProps={{
                          fontWeight: 700,
                          color: "#074568",
                        }}
                      />
                    )}
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </React.Fragment>
        );
      })}
    </List>
  );
}
