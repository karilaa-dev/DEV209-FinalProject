import React from "react";
import { Link } from "react-router-dom";
import { FaEyeSlash } from "react-icons/fa";

const PlaylistCard = ({ playlist, showHiddenIndicator = false }) => {
  // Default thumbnail if none is provided
  const defaultThumbnail = "https://via.placeholder.com/300x300?text=Playlist";
  
  // Get the first video's thumbnail or use default
  const thumbnailUrl = 
    playlist.videos && playlist.videos.length > 0 && playlist.videos[0].thumbnailUrl
      ? playlist.videos[0].thumbnailUrl
      : defaultThumbnail;
  
  return (
    <div className="playlist-card">
      <Link to={`/playlist/${playlist.id}`} className="playlist-card-link">
        <div className="playlist-card-thumbnail">
          <img src={thumbnailUrl} alt={playlist.name} />
          <div className="playlist-card-count">
            {playlist.videos ? playlist.videos.length : 0} videos
          </div>
          {playlist.isHidden && showHiddenIndicator && (
            <div className="playlist-hidden-indicator">
              <FaEyeSlash /> Hidden
            </div>
          )}
        </div>
        <div className="playlist-card-content">
          <h3 className="playlist-card-title">{playlist.name}</h3>
          {playlist.description && (
            <p className="playlist-card-description">
              {playlist.description.length > 60
                ? `${playlist.description.substring(0, 60)}...`
                : playlist.description}
            </p>
          )}
          <p className="playlist-card-creator">
            Created by: {playlist.creatorName || "Anonymous"}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default PlaylistCard;
