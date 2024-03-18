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

  // Potential search logic.

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     try {
//       const response = await fetch(`/news/${searchQuery}`);
//       if (response.ok) {
//         const data = await response.json();
//         console.log('News data:', data);
//         // Process the news data as needed
//       } else {
//         console.error('Failed to fetch news:', response.statusText);
//       }
//     } catch (error) {
//       console.error('Error fetching news:', error);
//     }
//     setSearchQuery('');
//   };
  

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
