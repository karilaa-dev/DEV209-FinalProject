import React, { useState, useEffect } from "react";
import { getCurrentUserData } from "../services/auth";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getPlaylist, removeVideoFromPlaylist, updateVideoInPlaylist, updateViewCount, updatePlaylistsWithoutViewCount } from "../services/playlist";
import Navbar from "../components/Navbar";
import VideoItem from "../components/VideoItem";
import VideoPlayerPopup from "../components/VideoPlayerPopup";
import { FaEdit, FaArrowLeft, FaStar } from "react-icons/fa";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase"; // Correct import path
import "../styles/pages/PlaylistDetailPage.css"; // Import the CSS file

const PlaylistDetailPage = () => {
    const { playlistId } = useParams();
    const { currentUser } = useAuth();
    const [playlist, setPlaylist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [removingIndex, setRemovingIndex] = useState(null);
    const [editingIndex, setEditingIndex] = useState(null);
    const [creatorName, setCreatorName] = useState("");
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [selectedVideoIndex, setSelectedVideoIndex] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);

    // Check if the current user is the owner of this playlist
    const isOwner = currentUser && playlist?.userId === currentUser.uid;

    // Update playlists without viewCount field
    useEffect(() => {
        const updateMissingViewCounts = async () => {
            try {
                const result = await updatePlaylistsWithoutViewCount();
                if (result.updatedCount > 0) {
                    console.log(`Updated ${result.updatedCount} playlists with missing view counts`);
                }
            } catch (err) {
                console.error("Error updating playlists without view count:", err);
            }
        };
        
        updateMissingViewCounts();
    }, []);

    // Fetch playlist data and update view count
    useEffect(() => {
        const fetchPlaylist = async () => {
            if (!playlistId) return;

            try {
                setLoading(true);
                const { playlist, error } = await getPlaylist(playlistId);

                if (error) {
                    throw new Error(error);
                }

                // Update view count
                await updateViewCount(playlistId);
                
                // If viewCount is undefined, set it to 0
                if (playlist.viewCount === undefined) {
                    playlist.viewCount = 0;
                }
                // We don't manually increment the view count here anymore
                // as it's already incremented in the updateViewCount function

                setPlaylist(playlist);
                setIsFavorite(playlist.isFavorite || false);

                // Set initial creator name from playlist data
                setCreatorName(playlist.creatorName || "Anonymous");

                // If userId exists, fetch the latest username
                if (playlist.userId) {
                    try {
                        const { userData, error } = await getCurrentUserData(playlist.userId);
                        if (!error && userData && userData.username) {
                            setCreatorName(userData.username);
                        }
                    } catch (err) {
                        console.error("Error fetching creator data:", err);
                    }
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPlaylist();
    }, [playlistId]);

    // Handle toggling favorite status
    const handleFavoriteToggle = async () => {
        const newFavoriteStatus = !isFavorite;
        setIsFavorite(newFavoriteStatus);

        try {
            const playlistDocRef = doc(db, "playlists", playlistId);
            await updateDoc(playlistDocRef, { isFavorite: newFavoriteStatus });
        } catch (error) {
            console.error("Error updating favorite status: ", error);
        }
    };

    // Handle video editing
    const handleEditVideo = async (index, updatedVideoData) => {
        try {
            setEditingIndex(index);
            const { error, video } = await updateVideoInPlaylist(playlistId, index, updatedVideoData);

            if (error) {
                throw new Error(error);
            }

            // Update the playlist in state
            const updatedVideos = [...playlist.videos];
            updatedVideos[index] = video;

            setPlaylist({
                ...playlist,
                videos: updatedVideos
            });
        } catch (err) {
            setError(`Failed to update video: ${err.message}`);
        } finally {
            setEditingIndex(null);
        }
    };

    // Handle video removal
    const handleRemoveVideo = async (index) => {
        if (!window.confirm("Are you sure you want to remove this video?")) {
            return;
        }

        try {
            setRemovingIndex(index);
            const { error } = await removeVideoFromPlaylist(playlistId, index);

            if (error) {
                throw new Error(error);
            }

            // Update the playlist in state
            const updatedVideos = [...playlist.videos];
            updatedVideos.splice(index, 1);

            setPlaylist({
                ...playlist,
                videos: updatedVideos
            });
        } catch (err) {
            setError(`Failed to remove video: ${err.message}`);
        } finally {
            setRemovingIndex(null);
        }
    };

    if (loading) {
        return (
            <div className="playlist-detail-page">
                <Navbar />
                <div className="loading">Loading playlist...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="playlist-detail-page">
                <Navbar />
                <div className="error-message">{error}</div>
            </div>
        );
    }

    if (!playlist) {
        return (
            <div className="playlist-detail-page">
                <Navbar />
                <div className="not-found">Playlist not found</div>
            </div>
        );
    }

    // Handle opening the video player popup
    const handleOpenVideo = (video, index) => {
        setSelectedVideo(video);
        setSelectedVideoIndex(index);
    };

    // Handle closing the video player popup
    const handleCloseVideo = () => {
        setSelectedVideo(null);
        setSelectedVideoIndex(null);
    };

    // Handle playing the next video in playlist
    const handleNextVideo = () => {
        if (playlist.videos && selectedVideoIndex < playlist.videos.length - 1) {
            const nextIndex = selectedVideoIndex + 1;
            setSelectedVideo(playlist.videos[nextIndex]);
            setSelectedVideoIndex(nextIndex);
        }
    };

    return (
        <div className="playlist-detail-page">
            <Navbar />

            <div className="playlist-detail-content">
                <div className="playlist-detail-header">
                    <Link to="/" className="back-link">
                        <FaArrowLeft /> Back to Playlists
                    </Link>

                    <div className="playlist-header-content">
                        <div className="playlist-title-container">
                            <div className="favorite-icon" onClick={handleFavoriteToggle}>
                                <FaStar className={isFavorite ? "favorite-checked" : "favorite-unchecked"} />
                            </div>
                            <h1 className="playlist-title">{playlist.name}</h1>
                        </div>
                        {playlist.description && (
                            <p className="playlist-description">{playlist.description}</p>
                        )}
                        <p className="playlist-creator">
                            Created by: {creatorName}
                        </p>
                        <p className="playlist-video-count">
                            {playlist.videos ? playlist.videos.length : 0} videos
                        </p>

                        <div className="playlist-actions">
                            {isOwner && (
                                <Link to={`/edit-playlist/${playlistId}`} className="edit-button">
                                    <FaEdit /> Edit Playlist
                                </Link>
                            )}
                        </div>
                        <p className="playlist-view-count">
                            {playlist.viewCount || 0} views
                        </p>
                    </div>
                </div>

                <div className="playlist-videos">
                    <h2>Videos</h2>

                    {playlist.videos && playlist.videos.length > 0 ? (
                        <div className="video-list">
                            {playlist.videos.map((video, index) => (
                                <VideoItem
                                    key={index}
                                    video={video}
                                    index={index}
                                    playlistId={playlistId}
                                    onClick={() => handleOpenVideo(video, index)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="no-videos">
                            <p>This playlist has no videos.</p>
                            {isOwner && (
                                <Link to={`/edit-playlist/${playlistId}`} className="add-videos-link">
                                    Add some videos
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Video Player Popup */}
            {selectedVideo && (
                <VideoPlayerPopup
                    video={selectedVideo}
                    onClose={handleCloseVideo}
                    onNext={handleNextVideo}
                    hasNext={playlist.videos && selectedVideoIndex < playlist.videos.length - 1}
                />
            )}
        </div>
    );
};

export default PlaylistDetailPage;
