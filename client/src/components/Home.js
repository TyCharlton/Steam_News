import React, { useState } from 'react';

function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Search Logic
    console.log('Search query:', searchQuery);
    setSearchQuery(''); 
  };

  return (
    <div>
      <div className="search_bar">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button type="submit">Search</button>
        </form>
      </div>
      {/* home*/}
    </div>
  );
}

export default Home;
