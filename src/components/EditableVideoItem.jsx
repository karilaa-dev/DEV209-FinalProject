import React, { useState, useEffect } from "react";
import { FaTrash, FaEdit, FaArrowUp, FaArrowDown, FaExternalLinkAlt } from "react-icons/fa";
import VideoEditModal from "./VideoEditModal";

const EditableVideoItem = ({ 
  video, 
  index, 
  playlistId, 
  onRemove, 
  onEdit, 
  onMoveUp, 
  onMoveDown, 
  isFirst, 
  isLast,
  autoOpenEditModal,
  onModalClosed
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Auto-open edit modal when autoOpenEditModal is true
  useEffect(() => {
    if (autoOpenEditModal) {
      setShowEditModal(true);
    }
  }, [autoOpenEditModal]);
  
  // Extract video ID from YouTube URL
  const getYouTubeVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getYouTubeVideoId(video.url);
  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/0.jpg` : null;

  const handleRemove = () => {
    if (onRemove) {
      onRemove(index);
    }
  };

  return (
    <div className="editable-video-item">
      <div className="video-thumbnail">
        {thumbnailUrl ? (
          <img src={thumbnailUrl} alt={video.title || "YouTube Video"} />
        ) : (
          <div className="invalid-video">Invalid YouTube URL</div>
        )}
      </div>
      <div className="video-details">
        <h3 className="video-title">{video.title || "Untitled Video"}</h3>
        {video.description && (
          <p className="video-description">{video.description}</p>
        )}
        <a
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          className="video-link"
        >
          Watch <FaExternalLinkAlt />
        </a>
      </div>
      <div className="video-actions">
        <div className="reorder-actions">
          <button 
            className="move-video-up" 
            onClick={() => onMoveUp(index)} 
            disabled={isFirst}
            title="Move up"
          >
            <FaArrowUp />
          </button>
          <button 
            className="move-video-down" 
            onClick={() => onMoveDown(index)} 
            disabled={isLast}
            title="Move down"
          >
            <FaArrowDown />
          </button>
        </div>
        <div className="edit-actions">
          <button className="edit-video-button" onClick={() => setShowEditModal(true)} title="Edit video">
            <FaEdit />
          </button>
          <button className="remove-video-button" onClick={handleRemove} title="Remove video">
            <FaTrash />
          </button>
        </div>
      </div>
      
      {showEditModal && (
        <VideoEditModal 
          video={video}
          onSave={(updatedVideoData) => {
            if (onEdit) {
              onEdit(index, updatedVideoData);
            }
            setShowEditModal(false);
            if (onModalClosed) {
              onModalClosed();
            }
          }}
          onCancel={() => {
            setShowEditModal(false);
            if (onModalClosed) {
              onModalClosed();
            }
          }}
        />
      )}
    </div>
  );
};

export default EditableVideoItem;
