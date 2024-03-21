import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from './UserContext';

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
    <button onClick={handleLogout} style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>
      Logout
    </button>
  );
}

export default Logout;
