import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/auth";
import { FaEnvelope, FaLock, FaUser, FaUserPlus } from "react-icons/fa";

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setError(null);
    setLoading(true);

    try {
      const { username, email, password } = formData;
      const { user, error } = await registerUser(email, password, username);

      if (error) {
        if (error.code === "auth/email-already-in-use") {
          throw new Error("Email is already in use");
        } else {
          throw new Error(error.message);
        }
      }

      // Redirect to home page on successful registration
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-container">
        <div className="signup-header">
          <Link to="/" className="signup-logo">
            <h2>Music Playlist Creator</h2>
          </Link>
        </div>

        <div className="signup-box">
          <div className="signup-box-header">
            <h1>Create an Account</h1>
            <p>Join our community of music lovers</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="signup-form">
            <div className="form-group">
              <div className="input-with-icon">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-with-icon">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-with-icon">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <small className="form-hint">Password must be at least 6 characters</small>
            </div>

            <div className="form-group">
              <div className="input-with-icon">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="terms-checkbox">
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms">
                I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>
              </label>
            </div>

            <button type="submit" className="signup-button" disabled={loading}>
              {loading ? (
                "Creating Account..."
              ) : (
                <>
                  <FaUserPlus /> Create Account
                </>
              )}
            </button>
          </form>

          <div className="signup-divider">
            <span>OR</span>
          </div>

          <div className="login-prompt">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="login-link">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
