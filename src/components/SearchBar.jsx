import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // If search term is cleared, reset search
    if (value === "") {
      onSearch("");
    }
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit}>
        <div className="search-input-container">
          <input
            type="text"
            placeholder="Search playlists..."
            value={searchTerm}
            onChange={handleChange}
            className="search-input"
          />
          <button type="submit" className="search-button">
            <FaSearch />
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
