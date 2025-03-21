import React from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import VideoThumbnail from "./VideoThumbnail";
import PropTypes from 'prop-types';

// Component for displaying a single video item in a playlist
const VideoItem = ({ video, index, playlistId, onClick }) => {
    // Handle click event on the video item
    const handleClick = () => {
        if (onClick) {
            onClick();
        }
    };

    return (
        <div className="video-item" onClick={handleClick}>
            {/* Display the position of the video in the playlist */}
            <div className="video-position"># {index + 1}</div>
            <div className="video-content">
                {/* Display the video thumbnail with a play button */}
                <VideoThumbnail video={video} showPlayButton={true} />
                <div className="video-details">
                    {/* Display the video title */}
                    <h3 className="video-title">{video.title || "Untitled Video"}</h3>
                    {/* Display the video description if available */}
                    {video.description && (
                        <p className="video-description">{video.description}</p>
                    )}
                    {/* Link to watch the video on YouTube */}
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

// Prop types for the VideoItem component
VideoItem.propTypes = {
    video: PropTypes.shape({
        title: PropTypes.string,
        description: PropTypes.string,
        url: PropTypes.string.isRequired,
        thumbnailUrl: PropTypes.string,
    }).isRequired,
    index: PropTypes.number.isRequired,
    playlistId: PropTypes.string,
    onClick: PropTypes.func,
};

export default VideoItem;
