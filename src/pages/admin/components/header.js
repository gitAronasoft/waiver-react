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
    <div className="container-fluid container-header ">
     <div className="container">



  <header className="header">
    <nav className="navbar navbar-expand-lg py-2">
      <div className="container-fluid">
        
        {/* Logo */}
        <Link className="navbar-brand" to="/admin/home">
          <img
            src="/assets/img/SKATE_AND_PLAY_V08_Full_Transparency (2) 1.png"
            className="img-fluid"
            alt="logo"
            style={{ height: "50px" }}
          />
        </Link>

        {/* Hamburger Button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span><i className="fa-solid fa-bars"></i></span>
        </button>


        <div className="d-flex d-lg-none align-items-center flex-wrap flex-lg-nowrap header-mobile-view ">
            
            {/* Notification Bell */}
            {/* <img
              src="/assets/img/bell-icon.png"
              alt="bell"
              className="me-3"
              style={{ width: "18px", height: "18px", cursor: "pointer" }}
            /> */}

            {/* Profile Dropdown */}
            <div className="dropdown" ref={dropdownRef}>
              <img
                src={
                  staff?.profile_image
                    ? `${BACKEND_URL}/api/${staff.profile_image}`
                    : "/assets/img/Vector.png"
                }
                alt="profile"
                className="dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  border: "2px solid #fff",
                  objectFit: "cover",
                  cursor: "pointer"
                }}
              />

              <ul className="dropdown-menu dropdown-menu-end">
                <li className="text-center px-3">
                  {/* <img
                    src={
                      staff?.profile_image
                        ? `${BACKEND_URL}/api/${staff.profile_image}`
                        : "/assets/img/Vector.png"
                    } */}

                    <img
                      src={
                        staff?.profile_image?.startsWith("http")
                          ? staff.profile_image
                          : `${BACKEND_URL}/api/${staff.profile_image}`
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
                  <h6>{staff?.name || "Admin User"}</h6>
                </li>
                <li><Link className="dropdown-item" to="/admin/change-password">Change Password</Link></li>
                <li><Link className="dropdown-item" to="/admin/update-profile">Update Profile</Link></li>
                <li><span className="dropdown-item" style={{ cursor: "pointer" }} onClick={handleLogout}>Sign Out</span></li>
              </ul>
            </div>
          </div>



        {/* Nav Items */}
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-4">
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
          </ul>

          {/* Right Side Icons */} 
          {/* <div className="d-flex align-items-center flex-wrap flex-lg-nowrap"> */}
            <div className="d-none d-lg-flex align-items-center flex-wrap flex-lg-nowrap">
            
            {/* Notification Bell */}
            {/* <img
              src="/assets/img/bell-icon.png"
              alt="bell"
              className="me-3"
              style={{ width: "24px", height: "24px", cursor: "pointer" }}
            /> */}

            {/* Profile Dropdown */}
            <div className="dropdown" ref={dropdownRef}>
              <img
                src={
                  staff?.profile_image
                    ? `${BACKEND_URL}/api/${staff.profile_image}`
                    : "/assets/img/Vector.png"
                }
                alt="profile"
                className="dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  border: "2px solid #fff",
                  objectFit: "cover",
                  cursor: "pointer"
                }}
              />

              <ul className="dropdown-menu dropdown-menu-end">
                <li className="text-center px-3">
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
                  <h6>{staff?.name || "Admin User"}</h6>
                </li>
                <li><Link className="dropdown-item" to="/admin/change-password">Change Password</Link></li>
                <li><Link className="dropdown-item" to="/admin/update-profile">Update Profile</Link></li>
                <li><span className="dropdown-item" style={{ cursor: "pointer" }} onClick={handleLogout}>Sign Out</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </header>
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
