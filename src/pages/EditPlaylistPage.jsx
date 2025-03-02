import React, { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getPlaylist } from "../services/playlist";
import Navbar from "../components/Navbar";
import PlaylistForm from "../components/PlaylistForm";

const EditPlaylistPage = () => {
  const { playlistId } = useParams();
  const { isAuthenticated, currentUser } = useAuth();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unauthorized, setUnauthorized] = useState(false);

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Redirect if unauthorized
  if (unauthorized) {
    return <Navigate to="/dashboard" />;
  }

  // Fetch playlist data
  useEffect(() => {
    const fetchPlaylist = async () => {
      if (!playlistId || !currentUser) return;

      try {
        setLoading(true);
        const { playlist, error } = await getPlaylist(playlistId);
        
        if (error) {
          throw new Error(error);
        }
        
        // Check if the user owns this playlist
        if (playlist.userId !== currentUser.uid) {
          setUnauthorized(true);
          return;
        }
        
        setPlaylist(playlist);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylist();
  }, [playlistId, currentUser]);

  return (
    <div className="edit-playlist-page">
      <Navbar />
      <div className="page-content">
        {loading ? (
          <div className="loading">Loading playlist...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : playlist ? (
          <PlaylistForm existingPlaylist={playlist} />
        ) : (
          <div className="error-message">Playlist not found</div>
        )}
      </div>
    </div>
  );
};

export default EditPlaylistPage;
