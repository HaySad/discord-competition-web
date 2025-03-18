import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const savedUsername = localStorage.getItem('currentUser');
    if (savedUsername) {
      setUsername(savedUsername);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    // Get existing users or initialize empty array
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Add new user if doesn't exist
    if (!users.includes(username)) {
      users.push(username);
      localStorage.setItem('users', JSON.stringify(users));
    }

    // Set current user
    localStorage.setItem('currentUser', username);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setIsLoggedIn(false);
    setUsername('');
  };

  if (isLoggedIn) {
    return (
      <div className="App">
        <h1>Welcome, {username}!</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  }

  return (
    <div className="App">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default App;
