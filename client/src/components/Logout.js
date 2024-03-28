import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from './UserContext';
import "../index.css";
function Logout() {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (currentUser.id) {
      sessionStorage.removeItem('currentUser');
      setCurrentUser({});
      alert('Logout success');
      navigate('/');
    } else {
      alert('User not logged in');
    }
  };

  return (
    <button className="logout-button" onClick={handleLogout}>
      Logout
    </button>
  );
}

export default Logout;
