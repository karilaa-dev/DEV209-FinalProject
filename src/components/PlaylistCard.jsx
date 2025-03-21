import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaEyeSlash, FaStar } from "react-icons/fa";
import { getCurrentUserData } from "../services/auth";
import { doc, updateDoc, setDoc, getDoc, increment } from "firebase/firestore";
import { db } from "../services/firebase"; // Correct import path
import { useAuth } from "../context/AuthContext"; // Import useAuth to get current user
import PropTypes from 'prop-types';

const PlaylistCard = ({ playlist, showHiddenIndicator = false }) => {
    const { currentUser } = useAuth(); // Get current user
    const [creatorName, setCreatorName] = useState(playlist.creatorName || "Anonymous");
    const [viewCount, setViewCount] = useState(playlist.viewCount || 0);
    const [isFavorite, setIsFavorite] = useState(false);

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

    useEffect(() => {
        const fetchFavoriteStatus = async () => {
            if (currentUser) {
                try {
                    const favoriteDocRef = doc(db, "users", currentUser.uid, "favorites", playlist.id);
                    const favoriteDoc = await getDoc(favoriteDocRef);
                    if (favoriteDoc.exists()) {
                        setIsFavorite(favoriteDoc.data().isFavorite);
                    }
                } catch (error) {
                    console.error("Error fetching favorite status:", error);
                }
            }
        };

        fetchFavoriteStatus();
    }, [currentUser, playlist.id]);

    const handleFavoriteToggle = async (e) => {
        e.preventDefault(); // Prevent the link from being followed
        const newFavoriteStatus = !isFavorite;
        setIsFavorite(newFavoriteStatus);

        try {
            const favoriteDocRef = doc(db, "users", currentUser.uid, "favorites", playlist.id);
            await setDoc(favoriteDocRef, { isFavorite: newFavoriteStatus });
        } catch (error) {
            console.error("Error updating favorite status: ", error);
        }
    };

    // We'll remove this function as view counting should only happen in PlaylistDetailPage
    // to avoid double counting

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
                    <div className="playlist-card-footer">
                        <p className="playlist-card-creator">
                            Created by: {creatorName}
                        </p>
                        <p className="playlist-card-views">
                            Views: {viewCount}
                        </p>
                    </div>
                </div>
            </Link>
        </div>
    );
};

PlaylistCard.propTypes = {
  playlist: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    userId: PropTypes.string,
    isHidden: PropTypes.bool,
    videos: PropTypes.arrayOf(PropTypes.object),
    viewCount: PropTypes.number,
    creatorName: PropTypes.string
  }).isRequired,
  showHiddenIndicator: PropTypes.bool
};

export default PlaylistCard;
