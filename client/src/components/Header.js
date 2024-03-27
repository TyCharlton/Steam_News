import React, { useState } from 'react';
import { GiHamburgerMenu } from 'react-icons/gi';
import { Link } from 'react-router-dom';
import { useUser } from './UserContext';
import '../index.css';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser } = useUser();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <div className="header-container">
      <div className="header">
        <h1 className="title">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <span className="neon-text">Steam News</span>
          </Link>
          <span id="subtitle" style={{ fontSize: '0.5em', display: 'block' }}>
            "Powered by Steam API"
          </span>
        </h1>
        {currentUser && Object.keys(currentUser).length !== 0 && <div>Hi, {currentUser.name}</div>}
        <div className="menu_icon" onClick={toggleMenu}>
          <GiHamburgerMenu />
        </div>
        {menuOpen && (
          <div className="menu">
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
        )}
      </div>
    </div>
  );
}

export default Header;
