import React from "react";
import { FaExternalLinkAlt, FaPlay } from "react-icons/fa";

const VideoItem = ({ video, index, playlistId, onClick }) => {
  // Extract video ID from YouTube URL
  const getYouTubeVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getYouTubeVideoId(video.url);
  // Use thumbnail image instead of iframe
  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div className="video-item" onClick={handleClick}>
      <div className="video-position"># {index + 1}</div>
      <div className="video-content">
        <div className="video-thumbnail">
          {thumbnailUrl ? (
            <>
              <img 
                src={thumbnailUrl} 
                alt={video.title || "YouTube Video"} 
              />
              <div className="video-play-button">
                <FaPlay />
              </div>
            </>
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
            onClick={(e) => e.stopPropagation()}
          >
            Watch on YouTube <FaExternalLinkAlt />
          </a>
        </div>
      </div>
    </div>
  );
};

export default VideoItem;
