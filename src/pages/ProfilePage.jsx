import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { updateUserNickname, updateUserPassword } from "../services/auth";
import Navbar from "../components/Navbar";
import { FaUser, FaKey } from "react-icons/fa";

const ProfilePage = () => {
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();
  
  // State for nickname section
  const [username, setUsername] = useState(userData?.username || "");
  const [usernameSuccess, setUsernameSuccess] = useState(false);
  const [usernameError, setUsernameError] = useState(null);
  const [updatingUsername, setUpdatingUsername] = useState(false);
  
  // State for password section
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Handle nickname update
  const handleUpdateNickname = async (e) => {
    e.preventDefault();
    
    // Reset states
    setUsernameError(null);
    setUsernameSuccess(false);
    
    if (!username.trim()) {
      setUsernameError("Username cannot be empty");
      return;
    }
    
    // If the username hasn't changed, don't make an API call
    if (username === userData?.username) {
      setUsernameSuccess(true);
      return;
    }
    
    try {
      setUpdatingUsername(true);
      const { success, error } = await updateUserNickname(currentUser.uid, username);
      
      if (error) {
        throw new Error(error);
      }
      
      if (success) {
        setUsernameSuccess(true);
        // NOTE: The AuthContext will automatically update with the new user data
        // due to the Firestore listener in AuthProvider
      }
    } catch (err) {
      setUsernameError(err.message);
    } finally {
      setUpdatingUsername(false);
    }
  };

  // Handle password update
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    
    // Reset states
    setPasswordError(null);
    setPasswordSuccess(false);
    
    // Validate passwords
    if (!currentPassword) {
      setPasswordError("Current password is required");
      return;
    }
    
    if (!newPassword) {
      setPasswordError("New password is required");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords don't match");
      return;
    }
    
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return;
    }
    
    try {
      setUpdatingPassword(true);
      const { success, error } = await updateUserPassword(currentPassword, newPassword);
      
      if (error) {
        throw new Error(error);
      }
      
      if (success) {
        setPasswordSuccess(true);
        // Clear the password fields
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setUpdatingPassword(false);
    }
  };

  // Redirect if not logged in
  if (!currentUser) {
    navigate("/login");
    return null;
  }

  return (
    <div className="profile-page">
      <Navbar />
      
      <div className="profile-content">
        <h1 className="page-title">Your Profile</h1>
        
        <div className="profile-email">
          <strong>Email:</strong> {currentUser.email}
        </div>
        
        <div className="profile-section">
          <div className="section-header">
            <FaUser className="section-icon" />
            <h2>Update Nickname</h2>
          </div>
          
          <form onSubmit={handleUpdateNickname} className="profile-form">
            <div className="form-group">
              <label htmlFor="username">Nickname</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-control"
                disabled={updatingUsername}
              />
            </div>
            
            {usernameError && (
              <div className="error-message">{usernameError}</div>
            )}
            
            {usernameSuccess && (
              <div className="success-message">Nickname updated successfully!</div>
            )}
            
            <button
              type="submit"
              className="update-button"
              disabled={updatingUsername}
            >
              {updatingUsername ? "Updating..." : "Update Nickname"}
            </button>
          </form>
        </div>
        
        <div className="profile-section">
          <div className="section-header">
            <FaKey className="section-icon" />
            <h2>Change Password</h2>
          </div>
          
          <form onSubmit={handleUpdatePassword} className="profile-form">
            <div className="form-group">
              <label htmlFor="currentPassword">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="form-control"
                disabled={updatingPassword}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="form-control"
                disabled={updatingPassword}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-control"
                disabled={updatingPassword}
              />
            </div>
            
            {passwordError && (
              <div className="error-message">{passwordError}</div>
            )}
            
            {passwordSuccess && (
              <div className="success-message">Password updated successfully!</div>
            )}
            
            <button
              type="submit"
              className="update-button"
              disabled={updatingPassword}
            >
              {updatingPassword ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
