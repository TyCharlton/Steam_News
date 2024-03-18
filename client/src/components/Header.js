import React, { useState } from 'react';
import { GiHamburgerMenu } from 'react-icons/gi';
import { Link } from 'react-router-dom';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="header">
      <h1 className="title">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <span className="neon-text">Steam News</span>
        </Link>
        <span id="subtitle" style={{ fontSize: '0.5em', display: 'block' }}>
          "Powered by Steam API"
        </span>
      </h1>
      <div className="menu_icon" onClick={toggleMenu}>
        <GiHamburgerMenu />
      </div>
      {menuOpen && (
        <div className="menu">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/createaccount">Create Account</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/settings">Settings</Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default Header;
