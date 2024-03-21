import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home({ isLoggedIn }) {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isLoggedIn) {
      if (!searchQuery.trim() || isNaN(searchQuery)) {
        console.error('Invalid search query:', searchQuery);
      } else {
        navigate(`/news/${searchQuery}`);
      }
    } else {
      console.error('User must be logged in to search');
    }
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
          {isLoggedIn && <button type="submit">Search</button>}
          {!isLoggedIn && <button disabled>Login to Search</button>}
        </form>
      </div>
    </div>
  );
}

export default Home;
