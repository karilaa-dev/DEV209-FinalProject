import React, { useState } from 'react';
import { searchYouTubeVideos } from '../services/youtube';
import { FaSearch, FaSpinner, FaExclamationCircle, FaCheckCircle, FaTimes } from 'react-icons/fa';

const YouTubeSearch = ({ onSelectVideo }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [noResults, setNoResults] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [showSelectionConfirmation, setShowSelectionConfirmation] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    // Clear previous results and reset states
    setSearchResults([]);
    setIsLoading(true);
    setError(null);
    setNoResults(false);
    setSelectedVideoId(null);
    setShowSelectionConfirmation(false);
    
    try {
      // Always get exactly 25 results
      const { videos, error } = await searchYouTubeVideos(searchQuery, 25);
      
      if (error) {
        setError(error);
        setSearchResults([]);
      } else {
        setSearchResults(videos);
        setNoResults(videos.length === 0);
        setShowSearchResults(true);
      }
    } catch (err) {
      setError(err.message || 'An error occurred while searching');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectVideo = (video) => {
    setSelectedVideoId(video.id);
    setShowSelectionConfirmation(true);
    setShowSearchResults(false);
    
    // Provide feedback that video was selected
    setTimeout(() => {
      setShowSelectionConfirmation(false);
      if (onSelectVideo) {
        onSelectVideo(video);
      }
    }, 1000);
  };
  
  const closeSearchResults = () => {
    setShowSearchResults(false);
  };

  return (
    <div className="youtube-search">
      <div className="youtube-search-container">
        <div className="search-input-container">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for YouTube videos..."
            className="youtube-search-input"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch();
              }
            }}
          />
          <button 
            onClick={handleSearch}
            className="youtube-search-button"
            disabled={isLoading}
            aria-label="Search YouTube"
            type="button"
          >
            {isLoading ? <FaSpinner className="spinner" /> : <FaSearch />}
          </button>
        </div>
      </div>
      
      {error && (
        <div className="youtube-search-error">
          <FaExclamationCircle /> {error}
        </div>
      )}
      
      {noResults && (
        <div className="youtube-search-no-results">
          No videos found for "{searchQuery}"
        </div>
      )}

      {showSelectionConfirmation && (
        <div className="youtube-search-confirmation">
          <FaCheckCircle /> Video added to playlist
        </div>
      )}
      
      {showSearchResults && searchResults.length > 0 && (
        <div className="youtube-search-results-popup">
          <div className="popup-header">
            <h3>Search Results</h3>
            <button className="close-button" onClick={closeSearchResults}>
              <FaTimes />
            </button>
          </div>
          <div className="popup-search-container">
            <div className="search-input-container">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for YouTube videos..."
                className="youtube-search-input"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSearch();
                  }
                }}
              />
              <button 
                onClick={handleSearch}
                className="youtube-search-button"
                disabled={isLoading}
                aria-label="Search YouTube"
                type="button"
              >
                {isLoading ? <FaSpinner className="spinner" /> : <FaSearch />}
              </button>
            </div>
          </div>
          <div className="youtube-search-results">
            {searchResults.map((video) => (
              <div
                key={video.id}
                className={`youtube-search-result-item ${selectedVideoId === video.id ? 'selected' : ''}`}
                onClick={() => handleSelectVideo(video)}
              >
                <div className="result-thumbnail">
                  <img src={video.thumbnailUrl} alt={video.title} />
                </div>
                <div className="result-details">
                  <h4 className="result-title">{video.title}</h4>
                  <p className="result-channel">{video.channelTitle}</p>
                  <p className="result-description">
                    {video.description.length > 100
                      ? `${video.description.substring(0, 100)}...`
                      : video.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default YouTubeSearch;
