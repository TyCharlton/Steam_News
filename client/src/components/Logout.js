import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from './UserContext';

function Logout() {
  const { setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('currentUser');
    setCurrentUser({});
    navigate('/'); 
  };

  return (
    <div>
      <h2>Logout</h2>
      <p>Are you sure you want to logout?</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Logout;
