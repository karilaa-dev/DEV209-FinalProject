import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './styles/index.css';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import CreatePlaylistPage from './pages/CreatePlaylistPage';
import EditPlaylistPage from './pages/EditPlaylistPage';
import PlaylistDetailPage from './pages/PlaylistDetailPage';
import ProfilePage from './pages/ProfilePage';

const App = () => {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/create-playlist" element={<CreatePlaylistPage />} />
        <Route path="/edit-playlist/:playlistId" element={<EditPlaylistPage />} />
        <Route path="/playlist/:playlistId" element={<PlaylistDetailPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </div>
  );
};

export default App;
