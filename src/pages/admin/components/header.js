import React, { useState, useEffect, useRef } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const staff = JSON.parse(localStorage.getItem("staff"));
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); // Reference for dropdown
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("staff");
    navigate("/admin/login");
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="container-fluid container-header">
      <div className="container">
        <div className="header">
          <div className="row d-flex align-items-center">
            {/* Logo */}
            <div className="col-md-3">
              <div className="logo">
                <Link to="/admin/home">
                  <img
                    src="/assets/img/SKATE_AND_PLAY_V08_Full_Transparency (2) 1.png"
                    className="img-fluid"
                    alt="logo"
                  />
                </Link>
              </div>
            </div>

            {/* Navigation */}
            <div className="col-md-7">
              <div className="nav-bar d-flex gap-5 align-items-center">
                <NavItem
                  to="/admin/home"
                  icon="/assets/img/Icon.png"
                  label="Home"
                  isActive={currentPath === "/admin/home"}
                />
                <NavItem
                  to="/admin/staff-list"
                  icon="/assets/img/team.png"
                  label="Team"
                  isActive={currentPath === "/admin/staff-list"}
                />
                <NavItem
                  to="/admin/history"
                  icon="/assets/img/refresh.png"
                  label="History"
                  isActive={currentPath === "/admin/history"}
                />
                <NavItem
                  to="/admin/feedback-list"
                  icon="/assets/img/review.png"
                  label="Feedback"
                  isActive={currentPath === "/admin/feedback-list"}
                />
                {/* <NavItem to="#" icon="/assets/img/Alerts.png" label="Alerts" /> */}
              </div>
            </div>

            {/* Profile & Notifications */}
            <div className="col-md-2 d-flex justify-content-end align-items-center position-relative">
              {/* Notification Bell */}
              <img
                src="/assets/img/bell-icon.png"
                alt="bell"
                className="me-3"
                style={{ width: "24px", height: "24px", cursor: "pointer" }}
              />

              {/* Profile Dropdown */}
              <div
                className="profile-dropdown"
                ref={dropdownRef}
                style={{ cursor: "pointer", position: "relative" }}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <img
                  src={
                    staff?.profile_image
                      ? `${BACKEND_URL}${staff.profile_image}`
                      : "/assets/img/Vector.png"
                  }
                  alt="profile"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    border: "2px solid #fff",
                    objectFit: "cover",
                  }}
                />

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div
                    className="dropdown-menu show"
                    style={{
                      position: "absolute",
                      top: "50px",
                      right: 0,
                      background: "#fff",
                      borderRadius: "8px",
                      padding: "10px",
                      minWidth: "200px",
                      boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                      zIndex: 1000,
                    }}
                  >
                    <div className="text-center mb-2">
                      <img
                        src={
                          staff?.profile_image
                            ? `${BACKEND_URL}/api/${staff.profile_image}`
                            : "/assets/img/Vector.png"
                        }
                        alt="profile"
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                          marginBottom: "8px",
                          objectFit: "cover",
                        }}
                      />
                      <h6 style={{ marginBottom: "5px" }}>
                        {staff?.name || "Admin User"}
                      </h6>
                      {/* <small>{staff?.role || "Admin"}</small> */}
                    </div>

                    <Link to="/admin/change-password" className="dropdown-item mb-2">
                      Change Password
                    </Link>
                    <Link to="/admin/update-profile" className="dropdown-item mb-2">
                      Update Profile
                    </Link>
                    <div
                      onClick={handleLogout}
                      className="dropdown-item"
                      style={{ cursor: "pointer" }}
                    >
                      Sign Out
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NavItem({ to, icon, label, isActive }) {
  return (
    <div>
      <Link to={to} className={`nav-link${isActive ? " active" : ""}`}>
        <div className="d-flex gap-1 flex-column text-white align-items-center">
          <div>
            <img src={icon} alt={label} />
          </div>
          <div>{label}</div>
        </div>
      </Link>
    </div>
  );
}

export default Header;
