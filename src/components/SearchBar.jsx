import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("SearchBar: Form submitted with term:", searchTerm);
    
    // Only search if there's a term
    if (searchTerm.trim() !== "") {
      console.log("SearchBar: Calling onSearch with term:", searchTerm);
      onSearch(searchTerm);
    } else {
      console.log("SearchBar: Empty search term, not searching");
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    console.log("SearchBar: Input changed to:", value);
    setSearchTerm(value);
    
    // If search term is cleared, reset search
    if (value === "") {
      console.log("SearchBar: Search term cleared, resetting search");
      onSearch("");
    }
  };

  // Add a separate click handler for the button
  const handleButtonClick = () => {
    console.log("SearchBar: Button clicked directly with term:", searchTerm);
    if (searchTerm.trim() !== "") {
      onSearch(searchTerm);
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
          <button 
            type="submit" 
            className="search-button"
            onClick={handleButtonClick}
          >
            <FaSearch />
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
