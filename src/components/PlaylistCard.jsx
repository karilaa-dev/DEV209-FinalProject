import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaEyeSlash, FaStar } from "react-icons/fa";
import { getCurrentUserData } from "../services/auth";

const PlaylistCard = ({ playlist, showHiddenIndicator = false }) => {
    const [creatorName, setCreatorName] = useState(playlist.creatorName || "Anonymous");
    const [viewCount, setViewCount] = useState(playlist.viewCount || 0);
    const [isFavorite, setIsFavorite] = useState(playlist.isFavorite || false);

    useEffect(() => {
        const fetchCreatorName = async () => {
            if (playlist.userId) {
                try {
                    const { userData, error } = await getCurrentUserData(playlist.userId);
                    if (!error && userData && userData.username) {
                        setCreatorName(userData.username);
                    }
                } catch (error) {
                    console.error("Error fetching creator data:", error);
                }
            }
        };

        fetchCreatorName();
    }, [playlist.userId]);

    const handleFavoriteToggle = (e) => {
        e.preventDefault(); // Prevent the link from being followed
        setIsFavorite(!isFavorite);
        // Here you would also update the favorite status in your backend or state management
    };

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
                    <div className="favorite-icon" onClick={handleFavoriteToggle}>
                        <FaStar className={isFavorite ? "favorite-checked" : "favorite-unchecked"} />
                    </div>
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
                        Created by: {creatorName}
                    </p>
                    <p className="playlist-card-views">
                        Views: {viewCount}
                    </p>
                </div>
            </Link>
        </div>
    );
};

export default PlaylistCard;