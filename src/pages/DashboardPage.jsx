import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUserPlaylists, deletePlaylist } from "../services/playlist";
import Navbar from "../components/Navbar";
import PlaylistCard from "../components/PlaylistCard";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";

const DashboardPage = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Fetch user playlists
  useEffect(() => {
    const fetchUserPlaylists = async () => {
      if (!currentUser) return;

      try {
        setLoading(true);
        const { playlists, error } = await getUserPlaylists(currentUser.uid);
        
        if (error) {
          throw new Error(error);
        }
        
        setUserPlaylists(playlists);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPlaylists();
  }, [currentUser]);

  // Handle playlist deletion
  const handleDeletePlaylist = async (playlistId) => {
    if (!window.confirm("Are you sure you want to delete this playlist?")) {
      return;
    }
    
    try {
      setDeletingId(playlistId);
      const { error } = await deletePlaylist(playlistId);
      
      if (error) {
        throw new Error(error);
      }
      
      // Remove deleted playlist from state
      setUserPlaylists(userPlaylists.filter(playlist => playlist.id !== playlistId));
    } catch (err) {
      setError(`Failed to delete playlist: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="dashboard-page">
      <Navbar />
      
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Your Dashboard</h1>
          <Link to="/create-playlist" className="create-playlist-button">
            <FaPlus /> Create New Playlist
          </Link>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="user-playlists-section">
          <h2>Your Playlists</h2>
          
          {loading ? (
            <div className="loading">Loading your playlists...</div>
          ) : userPlaylists.length === 0 ? (
            <div className="no-playlists">
              <p>You haven't created any playlists yet.</p>
              <p>
                <Link to="/create-playlist" className="create-playlist-link">
                  Create your first playlist
                </Link>
              </p>
            </div>
          ) : (
            <div className="user-playlists-grid">
              {userPlaylists.map((playlist) => (
                <div key={playlist.id} className="user-playlist-card-container">
                  <PlaylistCard playlist={playlist} />
                  <div className="playlist-actions">
                    <Link 
                      to={`/edit-playlist/${playlist.id}`} 
                      className="edit-playlist-button"
                      title="Edit playlist"
                    >
                      <FaEdit />
                    </Link>
                    <button
                      className="delete-playlist-button"
                      onClick={() => handleDeletePlaylist(playlist.id)}
                      disabled={deletingId === playlist.id}
                      title="Delete playlist"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
