import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logoutUser } from "../services/auth";
import { FaUser, FaCog } from "react-icons/fa";

const Navbar = () => {
  const { isAuthenticated, userData } = useAuth();
  const navigate = useNavigate();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    const { error } = await logoutUser();
    if (!error) {
      navigate("/");
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Music Playlist Creator
        </Link>

        <div className="navbar-search">
          {/* Search component will be rendered on the HomePage */}
        </div>

        <div className="navbar-buttons">
          {isAuthenticated ? (
            <>
              <span className="welcome-text">
                Welcome, {userData?.username || "User"}
              </span>
              <Link to="/dashboard" className="nav-button">
                Dashboard
              </Link>
              <div className="profile-dropdown-container" ref={dropdownRef}>
                <button 
                  className="profile-button"
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                >
                  <FaUser />
                </button>
                {showProfileDropdown && (
                  <div className="profile-dropdown">
                    <Link to="/profile" className="dropdown-item" onClick={() => setShowProfileDropdown(false)}>
                      <FaCog /> Profile Settings
                    </Link>
                    <button onClick={() => {
                      handleLogout();
                      setShowProfileDropdown(false);
                    }} className="dropdown-item logout-item">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-button">
                Login
              </Link>
              <Link to="/signup" className="nav-button">
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
