import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createPlaylist, updatePlaylist, addVideoToPlaylist } from "../services/playlist";
import { extractVideoId } from "../services/youtube";
import { FaPlus, FaTimes, FaLink, FaSearch, FaArrowUp, FaArrowDown } from "react-icons/fa";
import YouTubeSearch from "./YouTubeSearch";

const PlaylistForm = ({ existingPlaylist = null }) => {
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();
  const isEditing = !!existingPlaylist;

  const [formData, setFormData] = useState({
    name: existingPlaylist?.name || "",
    description: existingPlaylist?.description || "",
    isHidden: existingPlaylist?.isHidden || false,
  });

  const [activeTab, setActiveTab] = useState("url"); // 'url' or 'search'
  const [videoUrl, setVideoUrl] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [videos, setVideos] = useState(existingPlaylist?.videos || []);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Playlist name is required";
    }
    
    if (videos.length === 0) {
      newErrors.videos = "Add at least one video to your playlist";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddVideo = (e) => {
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
    
    setVideos([...videos, newVideo]);
    setVideoUrl("");
    setVideoTitle("");
    setVideoDescription("");
    setErrors({ ...errors, videoUrl: null, videos: null });
  };

  // Handle video from YouTube search
  const handleSelectVideo = (video) => {
    const newVideo = {
      url: video.url,
      title: video.title,
      description: video.description,
      thumbnailUrl: video.thumbnailUrl,
      addedAt: new Date().toISOString(),
    };
    
    setVideos([...videos, newVideo]);
    setActiveTab("url"); // Switch back to URL tab after adding
    setErrors({ ...errors, videos: null });
  };

  const handleRemoveVideo = (index) => {
    const updatedVideos = [...videos];
    updatedVideos.splice(index, 1);
    setVideos(updatedVideos);
  };
  
  const moveVideoUp = (index) => {
    if (index === 0) return; // Already at the top
    
    const updatedVideos = [...videos];
    const temp = updatedVideos[index];
    updatedVideos[index] = updatedVideos[index - 1];
    updatedVideos[index - 1] = temp;
    
    setVideos(updatedVideos);
  };
  
  const moveVideoDown = (index) => {
    if (index === videos.length - 1) return; // Already at the bottom
    
    const updatedVideos = [...videos];
    const temp = updatedVideos[index];
    updatedVideos[index] = updatedVideos[index + 1];
    updatedVideos[index + 1] = temp;
    
    setVideos(updatedVideos);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (isEditing) {
        // Update existing playlist
        const { error } = await updatePlaylist(existingPlaylist.id, {
          ...formData,
          videos,
          updatedAt: new Date().toISOString(),
        });
        
        if (error) {
          throw new Error(error);
        }
        
        navigate(`/playlist/${existingPlaylist.id}`);
      } else {
        // Create new playlist
        const result = await createPlaylist(
          {
            ...formData,
            videos,
            creatorName: userData?.username || "Anonymous",
            // Store the userId to enable dynamic lookup of latest username
            userId: currentUser.uid,
          },
          currentUser.uid
        );
        
        if (result.error) {
          throw new Error(result.error);
        }
        
        navigate(`/playlist/${result.id}`);
      }
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="playlist-form-container">
      <h2>{isEditing ? "Edit Playlist" : "Create New Playlist"}</h2>
      
      <form onSubmit={handleSubmit} className="playlist-form">
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
            rows="3"
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
            Hide playlist from main view (only accessible via direct link)
          </label>
          {formData.isHidden && (
            <p className="info-message">
              This playlist will not appear in the public playlist listings but can still be accessed via a direct link.
            </p>
          )}
        </div>
        
        <div className="videos-section">
          <h3>Videos</h3>
          {errors.videos && <div className="error-message">{errors.videos}</div>}
          
          <div className="video-list">
            {videos.map((video, index) => (
              <div key={index} className="video-list-item">
                <div className="video-list-thumbnail">
                  {video.thumbnailUrl ? (
                    <img src={video.thumbnailUrl} alt={video.title} />
                  ) : (
                    <div className="placeholder-thumbnail">No Thumbnail</div>
                  )}
                </div>
                <div className="video-list-details">
                  <h4>{video.title}</h4>
                  {video.description && <p>{video.description}</p>}
                </div>
                <div className="video-reorder-controls">
                  <button
                    type="button"
                    className="video-reorder-button"
                    onClick={() => moveVideoUp(index)}
                    disabled={index === 0}
                    title="Move up"
                  >
                    <FaArrowUp />
                  </button>
                  <button
                    type="button"
                    className="video-reorder-button"
                    onClick={() => moveVideoDown(index)}
                    disabled={index === videos.length - 1}
                    title="Move down"
                  >
                    <FaArrowDown />
                  </button>
                </div>
                <button
                  type="button"
                  className="remove-video"
                  onClick={() => handleRemoveVideo(index)}
                >
                  <FaTimes />
                </button>
              </div>
            ))}
          </div>
          
          <div className="add-video-form">
            <h4>Add Video</h4>
            
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
              <>
                <div className="form-group">
                  <label htmlFor="videoUrl">YouTube URL *</label>
                  <input
                    type="text"
                    id="videoUrl"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className={errors.videoUrl ? "error" : ""}
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                  {errors.videoUrl && (
                    <div className="error-message">{errors.videoUrl}</div>
                  )}
                </div>
                
                <div className="form-group">
                  <label htmlFor="videoTitle">Video Title</label>
                  <input
                    type="text"
                    id="videoTitle"
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    placeholder="Optional title for the video"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="videoDescription">Video Description</label>
                  <textarea
                    id="videoDescription"
                    value={videoDescription}
                    onChange={(e) => setVideoDescription(e.target.value)}
                    rows="2"
                    placeholder="Optional description"
                  />
                </div>
                
                <button
                  type="button"
                  className="add-video-button"
                  onClick={handleAddVideo}
                >
                  <FaPlus /> Add Video
                </button>
              </>
            ) : (
              <YouTubeSearch onSelectVideo={handleSelectVideo} />
            )}
          </div>
        </div>
        
        {errors.submit && (
          <div className="error-message submit-error">{errors.submit}</div>
        )}
        
        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Saving..."
              : isEditing
              ? "Update Playlist"
              : "Create Playlist"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlaylistForm;
