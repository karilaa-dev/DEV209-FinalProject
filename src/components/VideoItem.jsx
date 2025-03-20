import React from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import VideoThumbnail from "./VideoThumbnail";

const VideoItem = ({ video, index, playlistId, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div className="video-item" onClick={handleClick}>
      <div className="video-position"># {index + 1}</div>
      <div className="video-content">
        <VideoThumbnail video={video} showPlayButton={true} />
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
