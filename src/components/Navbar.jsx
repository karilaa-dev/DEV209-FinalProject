import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logoutUser } from "../services/auth";

const Navbar = () => {
  const { isAuthenticated, userData } = useAuth();
  const navigate = useNavigate();

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
              <button onClick={handleLogout} className="nav-button logout-button">
                Logout
              </button>
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
