import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getPlaylist, removeVideoFromPlaylist } from "../services/playlist";
import Navbar from "../components/Navbar";
import VideoItem from "../components/VideoItem";
import { FaEdit, FaArrowLeft } from "react-icons/fa";

const PlaylistDetailPage = () => {
  const { playlistId } = useParams();
  const { currentUser } = useAuth();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removingIndex, setRemovingIndex] = useState(null);

  // Check if the current user is the owner of this playlist
  const isOwner = currentUser && playlist?.userId === currentUser.uid;

  // Fetch playlist data
  useEffect(() => {
    const fetchPlaylist = async () => {
      if (!playlistId) return;

      try {
        setLoading(true);
        const { playlist, error } = await getPlaylist(playlistId);
        
        if (error) {
          throw new Error(error);
        }
        
        setPlaylist(playlist);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylist();
  }, [playlistId]);

  // Handle video removal
  const handleRemoveVideo = async (index) => {
    if (!window.confirm("Are you sure you want to remove this video?")) {
      return;
    }
    
    try {
      setRemovingIndex(index);
      const { error } = await removeVideoFromPlaylist(playlistId, index);
      
      if (error) {
        throw new Error(error);
      }
      
      // Update the playlist in state
      const updatedVideos = [...playlist.videos];
      updatedVideos.splice(index, 1);
      
      setPlaylist({
        ...playlist,
        videos: updatedVideos
      });
    } catch (err) {
      setError(`Failed to remove video: ${err.message}`);
    } finally {
      setRemovingIndex(null);
    }
  };

  if (loading) {
    return (
      <div className="playlist-detail-page">
        <Navbar />
        <div className="loading">Loading playlist...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="playlist-detail-page">
        <Navbar />
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="playlist-detail-page">
        <Navbar />
        <div className="not-found">Playlist not found</div>
      </div>
    );
  }

  return (
    <div className="playlist-detail-page">
      <Navbar />
      
      <div className="playlist-detail-content">
        <div className="playlist-detail-header">
          <Link to="/" className="back-link">
            <FaArrowLeft /> Back to Playlists
          </Link>
          
          <div className="playlist-header-content">
            <h1 className="playlist-title">{playlist.name}</h1>
            {playlist.description && (
              <p className="playlist-description">{playlist.description}</p>
            )}
            <p className="playlist-creator">
              Created by: {playlist.creatorName || "Anonymous"}
            </p>
            <p className="playlist-video-count">
              {playlist.videos ? playlist.videos.length : 0} videos
            </p>
          </div>
          
          {isOwner && (
            <div className="playlist-actions">
              <Link to={`/edit-playlist/${playlistId}`} className="edit-button">
                <FaEdit /> Edit Playlist
              </Link>
            </div>
          )}
        </div>
        
        <div className="playlist-videos">
          <h2>Videos</h2>
          
          {playlist.videos && playlist.videos.length > 0 ? (
            <div className="video-list">
              {playlist.videos.map((video, index) => (
                <VideoItem
                  key={index}
                  video={video}
                  index={index}
                  playlistId={playlistId}
                  isOwner={isOwner}
                  onRemove={isOwner ? handleRemoveVideo : null}
                />
              ))}
            </div>
          ) : (
            <div className="no-videos">
              <p>This playlist has no videos.</p>
              {isOwner && (
                <Link to={`/edit-playlist/${playlistId}`} className="add-videos-link">
                  Add some videos
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaylistDetailPage;
