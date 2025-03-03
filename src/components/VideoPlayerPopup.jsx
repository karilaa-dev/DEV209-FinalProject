import React, { useState } from "react";
import { FaTimes, FaCopy, FaArrowRight } from "react-icons/fa";

const VideoPlayerPopup = ({ video, onClose, onNext, hasNext }) => {
  const [copySuccess, setCopySuccess] = useState(false);

  // Extract video ID from YouTube URL
  const getYouTubeVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getYouTubeVideoId(video.url);
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(video.url).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="popup-modal video-popup-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{video.title || "Video Player"}</h3>
          <div className="popup-controls">
            {copySuccess && <span className="copy-success">Link Copied!</span>}
            <button className="popup-control-button" onClick={handleCopyLink} title="Copy video link">
              <FaCopy />
            </button>
            {hasNext && (
              <button className="popup-control-button" onClick={onNext} title="Next video">
                <FaArrowRight />
              </button>
            )}
            <button className="close-button" onClick={onClose}>
              <FaTimes />
            </button>
          </div>
        </div>
        <div className="video-player-container">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={video.title || "YouTube Video"}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <div className="invalid-video">Invalid YouTube URL</div>
          )}
        </div>
        {video.description && (
          <div className="video-popup-details">
            <p className="video-description">{video.description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayerPopup;
