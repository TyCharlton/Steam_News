import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const history = useHistory();

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!searchQuery.trim() || isNaN(searchQuery)) {
      console.error('Invalid search query:', searchQuery);
      // Display an error message or handle the invalid search query
    } else {
      history.push(`/news/${searchQuery}`); // Direct to SteamNews component with search query
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
          <button type="submit">Search</button>
        </form>
      </div>
    </div>
  );
}

export default Home;




// useEffect(() => {
//   checkLoginStatus();
// }, []);

// const checkLoginStatus = async () => {
//   try {
//     const response = await fetch('/check_session');
//     if (response.ok) {
//       setIsLoggedIn(true);
//     } else {
//       setIsLoggedIn(false);
//     }
//   } catch (error) {
//     console.error('Error checking login status:', error);
//   }
// };

// const handleSearchChange = (event) => {
//   setSearchQuery(event.target.value);
// };

// const handleLogin = async () => {
//   try {
//     const response = await fetch('/login', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ username: 'your_username', password: 'your_password' }), // Update with actual username and password
//     });
//     if (response.ok) {
//       setIsLoggedIn(true);
//       history.push('/'); // Redirect to home page after successful login
//     } else {
//       console.error('Login failed:', response.statusText);
//     }
//   } catch (error) {
//     console.error('Error logging in:', error);
//   }
// };

// const handleSubmit = async (event) => {
//   event.preventDefault();
//   if (isLoggedIn) {
//     // Perform search logic
//     console.log('Search query:', searchQuery);
//     setSearchQuery('');
//   } else {
//     // Redirect to login or create account
//     handleLogin(); // Attempt to login
//   }
// };

// return (
//   <div>
//     <div className="search_bar">
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           placeholder="Search..."
//           value={searchQuery}
//           onChange={handleSearchChange}
//         />
//         <button type="submit">Search</button>
//       </form>
//     </div>
//     {!isLoggedIn && (
//       <div>
//         <p>You must be logged in to search for games.</p>
//         <button onClick={() => history.push('/login')}>Login</button>
//         <button onClick={() => history.push('/createaccount')}>Create Account</button>
//       </div>
//     )}
//   </div>
// );
// }

// export default Home;


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