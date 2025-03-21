import React from "react";
import { extractVideoId } from "../services/youtube";
import { FaPlay } from "react-icons/fa";
import PropTypes from 'prop-types';

// Component for displaying a video thumbnail with an optional play button
const VideoThumbnail = ({ video, showPlayButton = false }) => {
    // Extract the video ID from the YouTube URL
    const videoId = extractVideoId(video.url);
    // Construct the thumbnail URL using the video ID
    const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;

    return (
        <div className="video-thumbnail">
            {thumbnailUrl ? (
                <>
                    {/* Display the video thumbnail */}
                    <img
                        src={thumbnailUrl}
                        alt={video.title || "YouTube Video"}
                    />
                    {/* Optionally display the play button overlay */}
                    {showPlayButton && (
                        <div className="video-play-button">
                            <FaPlay />
                        </div>
                    )}
                </>
            ) : (
                // Display a message if the YouTube URL is invalid
                <div className="invalid-video">Invalid YouTube URL</div>
            )}
        </div>
    );
};

// Prop types for the VideoThumbnail component
VideoThumbnail.propTypes = {
    video: PropTypes.shape({
        url: PropTypes.string.isRequired,
        title: PropTypes.string,
    }).isRequired,
    showPlayButton: PropTypes.bool,
};

export default VideoThumbnail;
