import React from "react";
import { extractVideoId } from "../services/youtube";
import { FaPlay } from "react-icons/fa";

const VideoThumbnail = ({ video, showPlayButton = false }) => {
  const videoId = extractVideoId(video.url);
  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;

  return (
    <div className="video-thumbnail">
      {thumbnailUrl ? (
        <>
          <img
            src={thumbnailUrl}
            alt={video.title || "YouTube Video"}
          />
          {showPlayButton && (
            <div className="video-play-button">
              <FaPlay />
            </div>
          )}
        </>
      ) : (
        <div className="invalid-video">Invalid YouTube URL</div>
      )}
    </div>
  );
};

export default VideoThumbnail;
