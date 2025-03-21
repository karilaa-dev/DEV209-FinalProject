import React, { useState, useEffect } from "react";
import { useParams, Navigate, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getPlaylist, updatePlaylist, removeVideoFromPlaylist, updateVideoInPlaylist, addVideoToPlaylist } from "../services/playlist";
import Navbar from "../components/Navbar";
import EditableVideoItem from "../components/EditableVideoItem";
import SortableVideoItem from "../components/SortableVideoItem";
import YouTubeSearch from "../components/YouTubeSearch";
import { extractVideoId } from "../services/youtube";
import { FaArrowLeft, FaPlus, FaLink, FaSearch, FaTimes } from "react-icons/fa";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";

const EditPlaylistPage = () => {
  const { playlistId } = useParams();
  const { isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unauthorized, setUnauthorized] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("url"); // 'url' or 'search'
  const [videoUrl, setVideoUrl] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [lastAddedVideoIndex, setLastAddedVideoIndex] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isHidden: false,
  });
  const [errors, setErrors] = useState({});

  // Set up sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
        setFormData({
          name: playlist.name || "",
          description: playlist.description || "",
          isHidden: playlist.isHidden || false,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylist();
  }, [playlistId, currentUser]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Handle video editing
  const handleEditVideo = async (index, updatedVideoData) => {
    try {
      const { error, video } = await updateVideoInPlaylist(playlistId, index, updatedVideoData);
      
      if (error) {
        throw new Error(error);
      }
      
      // Update the playlist in state
      const updatedVideos = [...playlist.videos];
      updatedVideos[index] = video;
      
      setPlaylist({
        ...playlist,
        videos: updatedVideos
      });
    } catch (err) {
      setError(`Failed to update video: ${err.message}`);
    }
  };

  // Handle video removal
  const handleRemoveVideo = async (index) => {
    if (!window.confirm("Are you sure you want to remove this video?")) {
      return;
    }
    
    try {
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
    }
  };

  // Handle adding video via URL
  const handleAddVideo = async (e) => {
    e.preventDefault();
    
    if (!videoUrl.trim()) {
      setErrors({ ...errors, videoUrl: "Video URL is required" });
      return;
    }
    
    // Simple validation for YouTube URL
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    if (!youtubeRegex.test(videoUrl)) {
      setErrors({ ...errors, videoUrl: "Please enter a valid YouTube URL" });
      return;
    }
    
    // Extract thumbnail from YouTube URL
    const videoId = extractVideoId(videoUrl);
    const thumbnailUrl = videoId 
      ? `https://img.youtube.com/vi/${videoId}/0.jpg` 
      : null;
    
    const newVideo = {
      url: videoUrl,
      title: videoTitle.trim() || "Untitled Video",
      description: videoDescription.trim(),
      thumbnailUrl,
      addedAt: new Date().toISOString(),
    };
    
    try {
      // Save the video to the database immediately
      const { error } = await addVideoToPlaylist(playlistId, newVideo);
      
      if (error) {
        throw new Error(error);
      }
      
      // Refresh the playlist data to get the updated videos array
      const { playlist: updatedPlaylist, error: fetchError } = await getPlaylist(playlistId);
      
      if (fetchError) {
        throw new Error(fetchError);
      }
      
      // Update the local state with the refreshed data
      setPlaylist(updatedPlaylist);
      
      // Clear form fields
      setVideoUrl("");
      setVideoTitle("");
      setVideoDescription("");
      setErrors({ ...errors, videoUrl: null, videos: null });
      
    } catch (err) {
      setError(`Failed to add video: ${err.message}`);
    }
  };

  // Handle video from YouTube search
  const handleSelectVideo = async (video) => {
    const newVideo = {
      url: video.url,
      title: video.title,
      description: video.description,
      thumbnailUrl: video.thumbnailUrl,
      addedAt: new Date().toISOString(),
    };
    
    try {
      // Save the video to the database immediately
      const { error } = await addVideoToPlaylist(playlistId, newVideo);
      
      if (error) {
        throw new Error(error);
      }
      
      // Refresh the playlist data to get the updated videos with correct indexes
      const { playlist: updatedPlaylist, error: fetchError } = await getPlaylist(playlistId);
      
      if (fetchError) {
        throw new Error(fetchError);
      }
      
      // Update the playlist in state with database data
      setPlaylist(updatedPlaylist);
      
      // Find the index of the newly added video (it will be the last one)
      const newVideoIndex = updatedPlaylist.videos.length - 1;
      
      // Set the index to trigger the edit modal
      setLastAddedVideoIndex(newVideoIndex);
      
      setActiveTab("url"); // Switch back to URL tab after adding
      setErrors({ ...errors, videos: null });
      
    } catch (err) {
      setError(`Failed to add video: ${err.message}`);
    }
  };
  
  // Handle moving video up in the list
  const handleMoveUp = async (index) => {
    if (index === 0) return; // Already at the top
    
    try {
      // Update local state first for immediate UI feedback
      const updatedVideos = [...playlist.videos];
      const temp = updatedVideos[index];
      updatedVideos[index] = updatedVideos[index - 1];
      updatedVideos[index - 1] = temp;
      
      const updatedPlaylist = {
        ...playlist,
        videos: updatedVideos
      };
      
      // Update the UI immediately
      setPlaylist(updatedPlaylist);
      
      // Save the changes to the database
      const { error } = await updatePlaylist(playlistId, {
        videos: updatedVideos,
        updatedAt: new Date().toISOString(),
      });
      
      if (error) {
        throw new Error(error);
      }
    } catch (err) {
      setError(`Failed to reorder video: ${err.message}`);
      // Fetch the playlist again to restore the correct order
      const { playlist: refreshedPlaylist } = await getPlaylist(playlistId);
      setPlaylist(refreshedPlaylist);
    }
  };
  
  // Handle moving video down in the list
  const handleMoveDown = async (index) => {
    if (index === playlist.videos.length - 1) return; // Already at the bottom
    
    try {
      // Update local state first for immediate UI feedback
      const updatedVideos = [...playlist.videos];
      const temp = updatedVideos[index];
      updatedVideos[index] = updatedVideos[index + 1];
      updatedVideos[index + 1] = temp;
      
      const updatedPlaylist = {
        ...playlist,
        videos: updatedVideos
      };
      
      // Update the UI immediately
      setPlaylist(updatedPlaylist);
      
      // Save the changes to the database
      const { error } = await updatePlaylist(playlistId, {
        videos: updatedVideos,
        updatedAt: new Date().toISOString(),
      });
      
      if (error) {
        throw new Error(error);
      }
    } catch (err) {
      setError(`Failed to reorder video: ${err.message}`);
      // Fetch the playlist again to restore the correct order
      const { playlist: refreshedPlaylist } = await getPlaylist(playlistId);
      setPlaylist(refreshedPlaylist);
    }
  };

  // Handle drag and drop reordering
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      // Extract the indexes from the id strings (format: "video-{index}")
      const activeIndex = parseInt(active.id.split('-')[1]);
      const overIndex = parseInt(over.id.split('-')[1]);
      
      // Update local state first for immediate UI feedback
      const updatedVideos = arrayMove(
        [...playlist.videos],
        activeIndex,
        overIndex
      );
      
      const updatedPlaylist = {
        ...playlist,
        videos: updatedVideos
      };
      
      // Update the UI immediately
      setPlaylist(updatedPlaylist);
      
      try {
        // Save the changes to the database
        const { error } = await updatePlaylist(playlistId, {
          videos: updatedVideos,
          updatedAt: new Date().toISOString(),
        });
        
        if (error) {
          throw new Error(error);
        }
      } catch (err) {
        setError(`Failed to reorder video: ${err.message}`);
        // Fetch the playlist again to restore the correct order
        const { playlist: refreshedPlaylist } = await getPlaylist(playlistId);
        setPlaylist(refreshedPlaylist);
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Playlist name is required";
    }
    
    if (!playlist.videos || playlist.videos.length === 0) {
      newErrors.videos = "Add at least one video to your playlist";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setErrors({ name: "Playlist name is required" });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Only update the playlist metadata, not the videos
      // since videos are now saved automatically when they are added/edited/removed
      const { error } = await updatePlaylist(playlistId, {
        name: formData.name,
        description: formData.description,
        isHidden: formData.isHidden,
        updatedAt: new Date().toISOString(),
      });
      
      if (error) {
        throw new Error(error);
      }
      
      navigate(`/playlist/${playlistId}`);
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="edit-playlist-page">
        <Navbar />
        <div className="loading">Loading playlist...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="edit-playlist-page">
        <Navbar />
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="edit-playlist-page">
        <Navbar />
        <div className="error-message">Playlist not found</div>
      </div>
    );
  }

  return (
    <div className="edit-playlist-page">
      <Navbar />
      
      <div className="edit-playlist-content">
        <div className="edit-playlist-header">
                  <form onSubmit={handleSubmit} className="playlist-header-form">
            <div className="form-group">
              <label htmlFor="name">Playlist Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? "error" : ""}
              />
              {errors.name && <div className="error-message">{errors.name}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="2"
              />
            </div>
            
            <div className="form-group checkbox-group">
              <label htmlFor="isHidden" className="checkbox-label">
                <input
                  type="checkbox"
                  id="isHidden"
                  name="isHidden"
                  checked={formData.isHidden}
                  onChange={handleChange}
                />
                Hide playlist from main view
              </label>
            </div>
            
            <div className="form-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={() => navigate(`/playlist/${playlistId}`)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Playlist"}
              </button>
            </div>
          </form>
        </div>
        
        <div className="edit-playlist-videos">
          <h2>Videos</h2>
          {errors.videos && <div className="error-message">{errors.videos}</div>}
          
          <div className="add-video-section">
            <h3>Add New Video</h3>
            
            <div className="add-video-tabs">
              <button
                type="button"
                className={`add-video-tab ${activeTab === "url" ? "active" : ""}`}
                onClick={() => setActiveTab("url")}
              >
                <FaLink /> Direct URL
              </button>
              <button
                type="button"
                className={`add-video-tab ${activeTab === "search" ? "active" : ""}`}
                onClick={() => setActiveTab("search")}
              >
                <FaSearch /> Search YouTube
              </button>
            </div>
            
            {activeTab === "url" ? (
              <div className="add-video-url-form">
                <div className="form-group">
                  <input
                    type="text"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className={errors.videoUrl ? "error" : ""}
                    placeholder="YouTube URL (https://www.youtube.com/watch?v=...)"
                  />
                  {errors.videoUrl && (
                    <div className="error-message">{errors.videoUrl}</div>
                  )}
                </div>
                
                <div className="form-group">
                  <input
                    type="text"
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    placeholder="Video Title (optional)"
                  />
                </div>
                
                <div className="form-group">
                  <textarea
                    value={videoDescription}
                    onChange={(e) => setVideoDescription(e.target.value)}
                    rows="1"
                    placeholder="Video Description (optional)"
                  />
                </div>
                
                <button
                  type="button"
                  className="add-video-button"
                  onClick={handleAddVideo}
                >
                  <FaPlus /> Add Video
                </button>
              </div>
            ) : (
              <div className="youtube-search-container">
                <YouTubeSearch onSelectVideo={handleSelectVideo} />
              </div>
            )}
          </div>
          
          {playlist.videos && playlist.videos.length > 0 ? (
            <DndContext 
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={playlist.videos.map((_, index) => `video-${index}`)}
                strategy={verticalListSortingStrategy}
              >
                <div className="editable-video-list">
                  {playlist.videos.map((video, index) => (
                    <SortableVideoItem
                      key={`video-${index}`}
                      id={`video-${index}`}
                      video={video}
                      index={index}
                      playlistId={playlistId}
                      onRemove={handleRemoveVideo}
                      onEdit={handleEditVideo}
                      onMoveUp={handleMoveUp}
                      onMoveDown={handleMoveDown}
                      isFirst={index === 0}
                      isLast={index === playlist.videos.length - 1}
                      autoOpenEditModal={index === lastAddedVideoIndex}
                      onModalClosed={() => setLastAddedVideoIndex(null)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          ) : (
            <div className="no-videos">
              <p>This playlist has no videos.</p>
              <p>Add some videos using the form above.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditPlaylistPage;
