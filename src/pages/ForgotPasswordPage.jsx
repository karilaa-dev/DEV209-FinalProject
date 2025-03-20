import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { resetPassword } from "../services/auth";
import { FaEnvelope, FaArrowLeft } from "react-icons/fa";
import "../styles/pages/ForgotPasswordPage.css";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const { success, error } = await resetPassword(email);

      if (error) {
        throw new Error(
          error.code === "auth/user-not-found"
            ? "No account found with this email address"
            : error.message
        );
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-wrapper">
      <div className="forgot-password-container">
        <div className="forgot-password-header">
          <Link to="/" className="forgot-password-logo">
            <h2>Music Playlist Creator</h2>
          </Link>
        </div>

        <div className="forgot-password-box">
          <div className="forgot-password-box-header">
            <h1>Reset Your Password</h1>
            <p>Enter your email address to receive a password reset link</p>
          </div>

          {error && <div className="auth-error">{error}</div>}
          
          {success && (
            <div className="auth-success">
              Password reset email sent! Check your inbox for further instructions.
            </div>
          )}

          <form onSubmit={handleSubmit} className="forgot-password-form">
            <div className="form-group">
              <div className="input-with-icon">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="forgot-password-button"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <div className="back-to-login">
            <Link to="/login" className="back-link">
              <FaArrowLeft /> Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
