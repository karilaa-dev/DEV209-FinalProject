import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import PlaylistForm from "../components/PlaylistForm";

const CreatePlaylistPage = () => {
  const { isAuthenticated } = useAuth();

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="create-playlist-page">
      <Navbar />
      <div className="page-content">
        <PlaylistForm />
      </div>
    </div>
  );
};

export default CreatePlaylistPage;
