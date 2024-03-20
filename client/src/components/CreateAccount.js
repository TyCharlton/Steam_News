import React, { useState } from 'react';

function CreateAccount() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [profImageUrl, setProfImageUrl] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:5555/createaccount', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          username: username,
          password: password,
          prof_image_url: profImageUrl
        }),
      });
      if (response.ok) {
        console.log('Account created successfully');
      } else {
        console.error('Failed to create account:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating account:', error);
    }
  };

  return (
    <div>
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Profile Image URL:
          <input
            type="text"
            value={profImageUrl}
            onChange={(e) => setProfImageUrl(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Create Account</button>
      </form>
    </div>
  );
}

export default CreateAccount;
