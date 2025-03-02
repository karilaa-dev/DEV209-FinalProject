import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import CreatePlaylistPage from './pages/CreatePlaylistPage';
import EditPlaylistPage from './pages/EditPlaylistPage';
import PlaylistDetailPage from './pages/PlaylistDetailPage';
import { AuthProvider } from './context/AuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/create-playlist" element={<CreatePlaylistPage />} />
          <Route path="/edit-playlist/:playlistId" element={<EditPlaylistPage />} />
          <Route path="/playlist/:playlistId" element={<PlaylistDetailPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  </React.StrictMode>
);
