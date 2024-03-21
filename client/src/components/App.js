import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Header from './Header';
import CreateAccount from './CreateAccount';
import Login from './Login';
import Logout from './Logout';
import Settings from './Settings';
import SteamNews from './SteamNews';
import UserContext from './UserContext';

function App() {
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    const userStorage = sessionStorage.getItem('currentUser');
    if (userStorage) {
      const user = JSON.parse(userStorage);
      setCurrentUser(user);
    }
  }, []);

  return (
    <div className="app_div">
      <UserContext.Provider value={{ currentUser, setCurrentUser }}>
        <Router>
          <Header />
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/news/:appId" element={<SteamNews />} /> 
            <Route path="/createaccount" element={<CreateAccount />} />
            <Route path="/login" element={<Login />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/logout" element={<Logout />} />
          </Routes>
        </Router>
      </UserContext.Provider>
    </div>
  );
}

export default App;
