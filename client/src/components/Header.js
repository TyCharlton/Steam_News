// Header.js

import React, { useState } from 'react';
import { GiHamburgerMenu } from 'react-icons/gi';
import { Link } from 'react-router-dom';
import { useUser } from './UserContext';
import '../index.css';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser } = useUser();

  const toggleMenu = () => {
    console.log('Toggle menu');
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    console.log('Close menu');
    setMenuOpen(false);
  };

  return (
    <div className="header">
      <h1 className="title">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <span className="neon-text">Steam News</span>
        </Link>
        <span id="subtitle" style={{ fontSize: '0.5em', display: 'block', marginBottom: '10px' }}>
          "Powered by Steam API"
        </span>
        {currentUser && Object.keys(currentUser).length !== 0 && (
          <span style={{ marginTop: '20px' }}>Hi, {currentUser.name}</span>
        )}
      </h1>

      <div className="menu-icon" onClick={toggleMenu}>
        <GiHamburgerMenu />
      </div>
      <div className={`menu ${menuOpen ? 'show' : ''}`}>
        <ul>
          <li>
            <Link to="/" onClick={closeMenu}>Home</Link>
          </li>
          <li>
            <Link to="/createaccount" onClick={closeMenu}>Create Account</Link>
          </li>
          <li>
            <Link to="/login" onClick={closeMenu}>Login</Link>
          </li>
          {currentUser && Object.keys(currentUser).length !== 0 && (
            <>
              <li>
                <Link to="/settings" onClick={closeMenu}>Settings</Link>
              </li>
              <li>
                <Link to="/logout" onClick={closeMenu}>Logout</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Header;
