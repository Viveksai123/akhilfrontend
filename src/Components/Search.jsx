import React from 'react';
import '../styles/Search.css';

function Search({ searchTerm, setSearchTerm }) {
  return (
    <div className="search">
      <div className="search-in">
        <input
          className="search-b"
          type="text"
          placeholder="Search for your destination"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term
        />
      </div>
    </div>
  );
}

export default Search;
