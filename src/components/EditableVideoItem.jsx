import React, { useState, useEffect } from "react";
import { FaTrash, FaEdit, FaExternalLinkAlt } from "react-icons/fa";
import VideoEditModal from "./VideoEditModal";
import { extractVideoId } from "../services/youtube";
import VideoThumbnail from "./VideoThumbnail";
import ReorderControls from "./ReorderControls";

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

  const handleRemove = () => {
    if (onRemove) {
      onRemove(index);
    }
  };

  return (
    <div className="editable-video-item">
      <VideoThumbnail video={video} />
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
        <ReorderControls
          onMoveUp={() => onMoveUp(index)}
          onMoveDown={() => onMoveDown(index)}
          disabledUp={isFirst}
          disabledDown={isLast}
        />
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
