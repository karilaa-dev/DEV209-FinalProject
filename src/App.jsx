import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import CreatePlaylistPage from './pages/CreatePlaylistPage';
import EditPlaylistPage from './pages/EditPlaylistPage';
import PlaylistDetailPage from './pages/PlaylistDetailPage';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('user') !== null;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/create-playlist" element={<CreatePlaylistPage />} />
          <Route path="/edit-playlist/:playlistId" element={<EditPlaylistPage />} />
          <Route path="/playlist/:playlistId" element={<PlaylistDetailPage />} />
        </Routes>
      </div>
    </AuthProvider>
  );
};

export default App;
