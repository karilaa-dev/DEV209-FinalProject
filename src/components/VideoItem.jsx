import React from "react";
import { FaExternalLinkAlt } from "react-icons/fa";

const VideoItem = ({ video, index, playlistId }) => {
  // Extract video ID from YouTube URL
  const getYouTubeVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getYouTubeVideoId(video.url);
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : null;

  return (
    <div className="video-item">
      <div className="video-position">{index + 1}</div>
      <div className="video-content">
        <div className="video-thumbnail">
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
            Watch on YouTube <FaExternalLinkAlt />
          </a>
        </div>
      </div>
    </div>
  );
};

export default VideoItem;
