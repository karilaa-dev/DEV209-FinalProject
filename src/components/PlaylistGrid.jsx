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
      try {
        const result = await getAllPlaylists();
        if (result.error) {
          setError(result.error);
        } else {
          setPlaylists(result.playlists);
          setLastVisible(result.lastVisible);
          setHasMore(result.playlists.length >= 8); // Assuming 8 items per page
        }
      } catch (err) {
        setError("Failed to load playlists");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  // Load more playlists when scrolling
  const fetchMorePlaylists = async () => {
    if (!lastVisible) {
      setHasMore(false);
      return;
    }

    try {
      const result = await getAllPlaylists(lastVisible);
      if (result.error) {
        setError(result.error);
      } else {
        setPlaylists([...playlists, ...result.playlists]);
        setLastVisible(result.lastVisible);
        setHasMore(result.playlists.length >= 8); // Assuming 8 items per page
      }
    } catch (err) {
      setError("Failed to load more playlists");
      console.error(err);
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
    <InfiniteScroll
      dataLength={filteredPlaylists.length}
      next={fetchMorePlaylists}
      hasMore={hasMore && !searchTerm} // Disable infinite scroll when searching
      loader={<div className="loading">Loading more playlists...</div>}
      endMessage={
        <div className="end-message">
          {filteredPlaylists.length > 0
            ? "You've seen all playlists!"
            : "No playlists found."}
        </div>
      }
    >
      <div className="playlist-grid">
        {filteredPlaylists.map((playlist) => (
          <PlaylistCard key={playlist.id} playlist={playlist} />
        ))}
      </div>
    </InfiniteScroll>
  );
};

export default PlaylistGrid;
