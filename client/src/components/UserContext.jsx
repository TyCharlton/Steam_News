import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  const checkSession = async () => {
    try {
      const response = await fetch('/check_session');
      if (response.ok) {
        const user = await response.json();
        setCurrentUser(user);
      }
    } catch (error) {
      console.error('Error checking session:', error);
    }
  };

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, checkSession }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
