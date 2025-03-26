import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUserPlaylists, deletePlaylist } from "../services/playlist";
import Navbar from "../components/Navbar";
import PlaylistCard from "../components/PlaylistCard";
import SearchBar from "../components/SearchBar";
import { FaPlus, FaTrash, FaEdit, FaLink } from "react-icons/fa";
import "../styles/pages/HomePage.css";

const DashboardPage = () => {
    const { isAuthenticated, currentUser } = useAuth();
    const [userPlaylists, setUserPlaylists] = useState([]);
    const [filteredPlaylists, setFilteredPlaylists] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    // Redirect if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    // Debug: log when searchTerm changes
    useEffect(() => {
        console.log("DashboardPage: searchTerm changed to:", searchTerm);
    }, [searchTerm]);

    // Fetch user playlists
    useEffect(() => {
        const fetchUserPlaylists = async () => {
            if (!currentUser) return;

            try {
                setLoading(true);
                const { playlists, error } = await getUserPlaylists(currentUser.uid);

                if (error) {
                    throw new Error(error);
                }

                setUserPlaylists(playlists);
                setFilteredPlaylists(playlists);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserPlaylists();
    }, [currentUser]);

    // Filter playlists based on search term
    useEffect(() => {
        if (searchTerm.trim() === "") {
            setFilteredPlaylists(userPlaylists);
        } else {
            const filtered = userPlaylists.filter(playlist => 
                playlist.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (playlist.description && playlist.description.toLowerCase().includes(searchTerm.toLowerCase()))
            );
            setFilteredPlaylists(filtered);
        }
    }, [searchTerm, userPlaylists]);

    const handleSearch = (term) => {
        console.log("DashboardPage: handleSearch called with term:", term);
        setSearchTerm(term);
    };

    // Handle playlist deletion
    const handleDeletePlaylist = async (playlistId) => {
        if (!window.confirm("Are you sure you want to delete this playlist?")) {
            return;
        }

        try {
            setDeletingId(playlistId);
            const { error } = await deletePlaylist(playlistId);

            if (error) {
                throw new Error(error);
            }

            // Remove deleted playlist from state
            const updatedPlaylists = userPlaylists.filter(playlist => playlist.id !== playlistId);
            setUserPlaylists(updatedPlaylists);
            setFilteredPlaylists(
                searchTerm.trim() === "" 
                    ? updatedPlaylists 
                    : updatedPlaylists.filter(playlist => 
                        playlist.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (playlist.description && playlist.description.toLowerCase().includes(searchTerm.toLowerCase()))
                    )
            );
        } catch (err) {
            setError(`Failed to delete playlist: ${err.message}`);
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="home-page">
            <Navbar />

            <div className="home-content">
                <div className="home-header">
                    <h1>Your Music Playlists</h1>
                    <p>Manage and organize your personal music collections</p>
                    <div className="search-container">
                        <SearchBar onSearch={handleSearch} />
                    </div>
                    <Link to="/create-playlist" className="create-playlist-button">
                        <FaPlus /> Create New Playlist
                    </Link>
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="most-popular-header">
                    <h2>Your Playlists</h2>
                </div>

                <div className="playlists-container">
                    {loading ? (
                        <div className="loading">Loading your playlists...</div>
                    ) : filteredPlaylists.length === 0 ? (
                        <div className="no-playlists">
                            {searchTerm.trim() !== "" ? (
                                <p>No playlists match your search.</p>
                            ) : (
                                <>
                                    <p>You haven't created any playlists yet.</p>
                                    <p>
                                        <Link to="/create-playlist" className="create-playlist-link">
                                            Create your first playlist
                                        </Link>
                                    </p>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="playlist-grid">
                            {filteredPlaylists.map((playlist) => (
                                <div key={playlist.id} className="user-playlist-card-container">
                                    <PlaylistCard playlist={playlist} showHiddenIndicator={true} />
                                    <div className="playlist-actions">
                                        <Link
                                            to={`/edit-playlist/${playlist.id}`}
                                            className="edit-playlist-button"
                                            title="Edit playlist"
                                        >
                                            <FaEdit />
                                        </Link>
                                        <button
                                            className="delete-playlist-button"
                                            onClick={() => handleDeletePlaylist(playlist.id)}
                                            disabled={deletingId === playlist.id}
                                            title="Delete playlist"
                                        >
                                            <FaTrash />
                                        </button>
                                        {playlist.isHidden && (
                                            <button
                                                className="share-playlist-button"
                                                onClick={() => {
                                                    const playlistUrl = `${window.location.origin}/playlist/${playlist.id}`;
                                                    navigator.clipboard.writeText(playlistUrl);
                                                    alert("Playlist link copied to clipboard!");
                                                }}
                                                title="Copy shareable link"
                                            >
                                                <FaLink />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
