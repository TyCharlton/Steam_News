import React, { useState } from 'react';
import { useUser } from './UserContext';

function Settings() {
  const { currentUser } = useUser();
  const [name, setName] = useState(currentUser.name || '');
  const [profImageUrl, setProfImageUrl] = useState(currentUser.prof_image_url || '');

  const handleUpdateUserInfo = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5555/user/${currentUser.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          prof_image_url: profImageUrl
        })
      });
      if (response.ok) {
      } else {
        console.error('Failed to update user info');
      }
    } catch (error) {
      console.error('Failed to update user info:', error);
    }
  };

  return (
    <div>
      <h1>Settings</h1>
      <form onSubmit={handleUpdateUserInfo}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          Profile Image URL:
          <input
            type="text"
            value={profImageUrl}
            onChange={(e) => setProfImageUrl(e.target.value)}
          />
        </label>
        <button type="submit">Update</button>
      </form>
    </div>
  );
}

export default Settings;
