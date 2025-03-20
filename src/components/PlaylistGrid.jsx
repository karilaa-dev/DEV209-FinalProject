import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import PlaylistCard from "./PlaylistCard";
import { getAllPlaylists } from "../services/playlist";

const PlaylistGrid = ({ searchTerm }) => {
  const [playlists, setPlaylists] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load initial playlists
  useEffect(() => {
    const fetchPlaylists = async () => {
      setLoading(true);
      console.log("Fetching initial playlists...");
      
      try {
        const result = await getAllPlaylists(null, 8); // Explicitly request 8 items
        
        if (result.error) {
          console.error("Error fetching initial playlists:", result.error);
          setError(result.error);
          return;
        }
        
        console.log(`Loaded ${result.playlists.length} initial playlists`);
        console.log("Last visible document:", result.lastVisible ? "exists" : "null");
        
        setPlaylists(result.playlists);
        setLastVisible(result.lastVisible);
        
        // Only set hasMore to true if we got a full page AND have a lastVisible cursor
        const hasMoreData = result.playlists.length >= 8 && result.lastVisible !== null;
        console.log(`Setting hasMore to ${hasMoreData}`);
        setHasMore(hasMoreData);
      } catch (err) {
        console.error("Failed to load initial playlists:", err);
        setError("Failed to load playlists");
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);
  
  // Reset hasMore when searchTerm changes
  useEffect(() => {
    // If we have playlists and a search term, check if we need to fetch more
    if (playlists.length > 0 && searchTerm) {
      const matchingResults = playlists.filter(
        playlist =>
          playlist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (playlist.description &&
            playlist.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      
      // If we have very few matching results, allow more fetching
      const hasEnoughResults = matchingResults.length >= 12;
      setHasMore(!hasEnoughResults && lastVisible !== null);
    } else if (playlists.length > 0) {
      // When search is cleared, restore normal scrolling behavior
      setHasMore(lastVisible !== null);
    }
  }, [searchTerm, playlists, lastVisible]);

  // Load more playlists when scrolling
  const fetchMorePlaylists = async () => {
    console.log("fetchMorePlaylists called", { lastVisible, hasMore });
    
    if (!lastVisible) {
      console.log("No more playlists to fetch (lastVisible is null)");
      setHasMore(false);
      return;
    }

    try {
      console.log("Fetching more playlists...");
      const result = await getAllPlaylists(lastVisible);
      
      if (result.error) {
        console.error("Error fetching more playlists:", result.error);
        setError(result.error);
        return;
      }
      
      console.log(`Fetched ${result.playlists.length} more playlists`);
      
      if (result.playlists.length === 0) {
        console.log("No more playlists returned from server");
        setHasMore(false);
        return;
      }
      
      const newPlaylists = [...playlists, ...result.playlists];
      setPlaylists(newPlaylists);
      setLastVisible(result.lastVisible);
      
      // Always set hasMore based on whether we got a full page of results
      const gotFullPage = result.playlists.length >= 8;
      console.log(`Got ${result.playlists.length} playlists, hasMore: ${gotFullPage}`);
      setHasMore(gotFullPage);
      
      // If we're searching, log the number of matching results
      if (searchTerm) {
        const matchingResults = newPlaylists.filter(
          playlist =>
            playlist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (playlist.description &&
              playlist.description.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        console.log(`Search term: "${searchTerm}", matching results: ${matchingResults.length}`);
      }
    } catch (err) {
      console.error("Error in fetchMorePlaylists:", err);
      setError("Failed to load more playlists");
    }
  };

  // Filter playlists based on search term
  const filteredPlaylists = searchTerm
    ? playlists.filter(
        (playlist) =>
          playlist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (playlist.description &&
            playlist.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : playlists;

  if (loading && playlists.length === 0) {
    return <div className="loading">Loading playlists...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (filteredPlaylists.length === 0) {
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
        dataLength={filteredPlaylists.length}
        next={fetchMorePlaylists}
        hasMore={hasMore} // Allow infinite scroll even when searching
        loader={<div className="loading">Loading more playlists...</div>}
        scrollThreshold={0.8} // Trigger earlier (when 80% scrolled)
        scrollableTarget="scrollable-playlist-container"
        endMessage={
          <div className="end-message">
            {filteredPlaylists.length > 0
              ? searchTerm 
                ? "No more playlists match your search."
                : "You've seen all playlists!"
              : "No playlists found."}
          </div>
        }
      >
        <div className="playlist-grid">
          {filteredPlaylists.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
        
        {/* Manual load more button as fallback */}
        {hasMore && (
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
