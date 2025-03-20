import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import PlaylistGrid from "../components/PlaylistGrid";

const HomePage = () => {
    const [searchTerm, setSearchTerm] = useState("");

    // Debug: log when searchTerm changes
    useEffect(() => {
        console.log("HomePage: searchTerm changed to:", searchTerm);
    }, [searchTerm]);

    const handleSearch = (term) => {
        console.log("HomePage: handleSearch called with term:", term);
        setSearchTerm(term);
    };

    return (
        <div className="home-page">
            <Navbar />

            <div className="home-content">
                <div className="home-header">
                    <h1>Music Playlists</h1>
                    <p>Discover and enjoy music playlists created by our community</p>
                    <div className="search-container">
                        <SearchBar onSearch={handleSearch} />
                    </div>
                </div>

                <div className="most-popular-header">
                    <h2>Most Popular</h2>
                </div>

                <div className="playlists-container">
                    <PlaylistGrid searchTerm={searchTerm} />
                </div>
            </div>
        </div>
    );
};

export default HomePage;
