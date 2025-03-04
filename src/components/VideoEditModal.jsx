import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

const VideoEditModal = ({ video, onSave, onCancel }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState("");

  // Initialize form with video data
  useEffect(() => {
    if (video) {
      setTitle(video.title || "");
      setDescription(video.description || "");
      setUrl(video.url || "");
    }
  }, [video]);

  // Validate YouTube URL
  const validateUrl = (url) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]{11}$/;
    return youtubeRegex.test(url);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate URL
    if (!validateUrl(url)) {
      setUrlError("Please enter a valid YouTube URL");
      return;
    }
    
    // Call the onSave callback with updated data
    onSave({
      title,
      description,
      url
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content video-edit-modal popup-modal">
        <div className="modal-header">
          <h2>Edit Video</h2>
          <button className="close-button" onClick={onCancel}>
            <FaTimes />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Video title"
              required
              className="form-control"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Video description (optional)"
              className="form-control"
              rows="3"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="url">YouTube URL</label>
            <input
              type="text"
              id="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setUrlError(""); // Clear error when typing
              }}
              placeholder="https://www.youtube.com/watch?v=..."
              required
              className={`form-control ${urlError ? "error" : ""}`}
            />
            {urlError && <div className="error-message">{urlError}</div>}
          </div>
          
          <div className="modal-actions">
            <button type="button" className="cancel-button" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="save-button">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VideoEditModal;
