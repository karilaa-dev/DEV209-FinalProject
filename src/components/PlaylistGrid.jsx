import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import PlaylistCard from "./PlaylistCard";
import { getAllPlaylists, searchPlaylists } from "../services/playlist";

const PlaylistGrid = ({ searchTerm }) => {
  const [playlists, setPlaylists] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // Debug searchTerm changes
  useEffect(() => {
    console.log(`SearchTerm changed to: "${searchTerm || ''}"`);
  }, [searchTerm]);

  // Load initial playlists or search for playlists when searchTerm changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        if (searchTerm) {
          // If there's a search term, use the enhanced searchPlaylists function
          console.log(`Searching playlists for: "${searchTerm}"`);
          setIsSearching(true);
          
          const result = await searchPlaylists(searchTerm);
          
          if (result.error) {
            throw new Error(result.error);
          }
          
          setPlaylists(result.playlists);
          setHasMore(false); // No pagination for search results currently
          console.log(`Found ${result.playlists.length} playlists matching "${searchTerm}"`);
        } else {
          // No search term, load normal paginated playlists
          console.log("Fetching initial playlists...");
          setIsSearching(false);
          
          const result = await getAllPlaylists(null, 8);
          
          if (result.error) {
            throw new Error(result.error);
          }
          
          setPlaylists(result.playlists);
          setLastVisible(result.lastVisible);
          
          // Only set hasMore to true if we got a full page AND have a lastVisible cursor
          const hasMoreData = result.playlists.length >= 8 && result.lastVisible !== null;
          setHasMore(hasMoreData);
          console.log(`Loaded ${result.playlists.length} initial playlists, hasMore: ${hasMoreData}`);
        }
      } catch (err) {
        console.error("Error fetching playlists:", err);
        setError(err.message || "Failed to load playlists");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchTerm]); // Re-run when searchTerm changes

  // Load more playlists when scrolling (only for non-search mode)
  const fetchMorePlaylists = async () => {
    // Don't fetch more if we're in search mode
    if (isSearching || !lastVisible) {
      setHasMore(false);
      return;
    }

    try {
      console.log("Fetching more playlists...");
      const result = await getAllPlaylists(lastVisible);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      if (result.playlists.length === 0) {
        setHasMore(false);
        return;
      }
      
      setPlaylists(prev => [...prev, ...result.playlists]);
      setLastVisible(result.lastVisible);
      
      // Set hasMore based on whether we got a full page of results
      setHasMore(result.playlists.length >= 8 && result.lastVisible !== null);
    } catch (err) {
      console.error("Error in fetchMorePlaylists:", err);
      setError("Failed to load more playlists");
    }
  };

  if (loading && playlists.length === 0) {
    return <div className="loading">Loading playlists...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (playlists.length === 0) {
    return (
      <div className="no-playlists">
        {searchTerm
          ? `No playlists found matching "${searchTerm}"`
          : "No playlists available. Create one!"}
      </div>
    );
  }

  return (
    <div id="scrollable-playlist-container" style={{ minHeight: "100vh", overflow: "auto" }}>
      <InfiniteScroll
        dataLength={playlists.length}
        next={fetchMorePlaylists}
        hasMore={hasMore} 
        loader={<div className="loading">Loading more playlists...</div>}
        scrollThreshold={0.8} // Trigger earlier (when 80% scrolled)
        scrollableTarget="scrollable-playlist-container"
        endMessage={
          <div className="end-message">
            {playlists.length > 0
              ? searchTerm 
                ? "No more playlists match your search."
                : "You've seen all playlists!"
              : "No playlists found."}
          </div>
        }
      >
        <div className="playlist-grid">
          {playlists.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
        
        {/* Manual load more button as fallback (only show when not searching) */}
        {hasMore && !isSearching && (
          <div className="load-more-container" style={{ textAlign: "center", margin: "20px 0" }}>
            <button 
              onClick={fetchMorePlaylists}
              style={{
                padding: "10px 20px",
                background: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Load More Playlists
            </button>
          </div>
        )}
      </InfiniteScroll>
    </div>
  );
};

export default PlaylistGrid;
