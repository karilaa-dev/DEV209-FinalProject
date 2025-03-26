import React, { useState, useCallback } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createPlaylist } from "../services/playlist";
import Navbar from "../components/Navbar";
import YouTubeSearch from "../components/YouTubeSearch";
import useVideoManagement from "../hooks/useVideoManagement";
import { FaPlus, FaLink, FaSearch } from "react-icons/fa";
import { extractVideoId } from "../services/youtube";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import SortableVideoItem from "../components/SortableVideoItem.jsx";

const CreatePlaylistPage = () => {
  const { isAuthenticated, currentUser, userData } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isHidden: false,
  });

  const [activeTab, setActiveTab] = useState("url"); // 'url' or 'search'
  const {
    videos,
    videoUrl,
    setVideoUrl,
    videoTitle,
    setVideoTitle,
    videoDescription,
    setVideoDescription,
    addVideo,
    selectVideo,
    removeVideo,
    moveVideoUp,
    moveVideoDown,
  } = useVideoManagement([]);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;

    if (!active || !over) {
      console.warn("handleDragEnd: missing active or over");
      return;
    }

    if (active.id !== over.id) {
      const oldIndex = videos.findIndex(video => `video-${video.id}` === active.id);
      const newIndex = videos.findIndex(video => `video-${video.id}` === over.id);

      if (oldIndex < 0 || newIndex < 0) {
        console.warn("handleDragEnd: video not found in videos array");
        return;
      }

      const updatedVideos = arrayMove(videos, oldIndex, newIndex);
    }
  }, [videos, arrayMove]);

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

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

    // Add video to the list
    addVideo(newVideo);

    // Clear form fields
    setErrors({ ...errors, videoUrl: null, videos: null });
  };

  // Handle video from YouTube search
  const handleSelectVideo = (video) => {
    selectVideo(video);
    setActiveTab("url"); // Switch back to URL tab after adding
    setErrors({ ...errors, videos: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
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
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveVideo = useCallback((index) => {
    removeVideo(index);
  }, [removeVideo]);

  const handleMoveUp = useCallback((index) => {
    moveVideoUp(index);
  }, [moveVideoUp]);

  const handleMoveDown = useCallback((index) => {
    moveVideoDown(index);
  }, [moveVideoDown]);

  return (
    <div className="create-playlist-page">
      <Navbar />

      <div className="create-playlist-content">
        <div className="create-playlist-header">
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
          </form>
        </div>

        <div className="create-playlist-videos">
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

          {videos && videos.length > 0 ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={videos.map((video, index) => `video-${index}`)}
                strategy={verticalListSortingStrategy}
              >
                <div className="editable-video-list">
                  {videos.map((video, index) => (
                    <SortableVideoItem
                      key={`video-${index}`}
                      id={`video-${index}`}
                      video={video}
                      index={index}
                      onRemove={handleRemoveVideo}
                      onMoveUp={handleMoveUp}
                      onMoveDown={handleMoveDown}
                      isFirst={index === 0}
                      isLast={index === videos.length - 1}
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
              onClick={handleSubmit}
            >
              {isSubmitting ? "Creating..." : "Create Playlist"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePlaylistPage;
