import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
import '../index.css';

function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { currentUser } = useUser();

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!currentUser.id) {
      alert('You need to be logged in to search for a game.');
      return;
    }

    if (!searchQuery.trim() || isNaN(searchQuery)) {
      console.error('Invalid search query:', searchQuery);
    } else {
      navigate(`/news/${searchQuery}`);
    }
  };

  return (
    <div className="center">
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
      {!currentUser.id && (
        <div>
          <p></p>
          <button onClick={() => navigate('/createaccount')}>Create Account</button>
          <button onClick={() => navigate('/login')}>Already have an account?</button>
        </div>
      )}
    </div>
  );
}

export default Home;
