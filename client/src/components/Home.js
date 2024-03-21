import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';

function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { currentUser } = useUser();

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!searchQuery.trim() || isNaN(searchQuery)) {
      console.error('Invalid search query:', searchQuery);
    } else {
      navigate(`/news/${searchQuery}`);
    }
  };

  return (
    <div>
      {currentUser ? (
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
      ) : (
        <p>You must be logged in to search for games.</p>
      )}
    </div>
  );
}

export default Home;
