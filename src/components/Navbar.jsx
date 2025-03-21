import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logoutUser } from "../services/auth";
import { FaUser, FaCog, FaBars, FaTimes } from "react-icons/fa";
import PropTypes from 'prop-types';

const Navbar = () => {
    const { isAuthenticated, userData } = useAuth();
    const navigate = useNavigate();
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
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

    // Prevent body scrolling when mobile menu is open
    useEffect(() => {
        if (showMobileMenu) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [showMobileMenu]);

    const handleLogout = async () => {
        const { error } = await logoutUser();
        if (!error) {
            setShowMobileMenu(false);
            navigate("/");
        }
    };

    return (
        <>
            <nav className="navbar">
                <div className="navbar-container">
                    <Link to="/" className="navbar-logo">
                        Music Playlist Creator
                    </Link>

                    <div className="navbar-search">
                        {/* Search component is rendered on the HomePage */}
                    </div>

                    <button 
                        className="mobile-menu-button"
                        onClick={() => setShowMobileMenu(true)}
                        aria-label="Open menu"
                    >
                        <FaBars />
                    </button>

                    <div className="navbar-buttons">
                        {isAuthenticated ? (
                            <>
                                <span className="welcome-text">
                                    Welcome, {userData?.username || "User"}
                                </span>
                                <Link to="/" className="nav-button">
                                    Home
                                </Link>
                                <Link to="/dashboard" className="nav-button">
                                    Dashboard
                                </Link>
                                <div className="profile-dropdown-container" ref={dropdownRef}>
                                    <button
                                        className="profile-button"
                                        onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                                        aria-label="Profile menu"
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

            {/* Mobile Navigation Menu */}
            <div className={`mobile-nav ${showMobileMenu ? 'open' : ''}`}>
                <button 
                    className="mobile-nav-close"
                    onClick={() => setShowMobileMenu(false)}
                    aria-label="Close menu"
                >
                    <FaTimes />
                </button>

                <div className="mobile-nav-items">
                    {isAuthenticated ? (
                        <>
                            <div className="mobile-welcome-text">
                                Welcome, {userData?.username || "User"}
                            </div>
                            <Link 
                                to="/" 
                                className="mobile-nav-item"
                                onClick={() => setShowMobileMenu(false)}
                            >
                                Home
                            </Link>
                            <Link 
                                to="/dashboard" 
                                className="mobile-nav-item"
                                onClick={() => setShowMobileMenu(false)}
                            >
                                Dashboard
                            </Link>
                            <Link 
                                to="/profile" 
                                className="mobile-nav-item"
                                onClick={() => setShowMobileMenu(false)}
                            >
                                Profile Settings
                            </Link>
                            <button 
                                onClick={() => {
                                    handleLogout();
                                    setShowMobileMenu(false);
                                }} 
                                className="mobile-nav-item mobile-logout-button"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link 
                                to="/login" 
                                className="mobile-nav-item"
                                onClick={() => setShowMobileMenu(false)}
                            >
                                Login
                            </Link>
                            <Link 
                                to="/signup" 
                                className="mobile-nav-item"
                                onClick={() => setShowMobileMenu(false)}
                            >
                                Signup
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

Navbar.propTypes = {
  isAuthenticated: PropTypes.bool,
  userData: PropTypes.shape({
    username: PropTypes.string
  })
};

export default Navbar;
