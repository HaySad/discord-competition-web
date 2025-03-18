import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import MainPage from './MainPage';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [sessionExpiry, setSessionExpiry] = useState<Date | null>(null);
  const [sessionCheckInterval, setSessionCheckInterval] = useState<NodeJS.Timeout | null>(null);

  // Check session status on component mount
  useEffect(() => {
    checkSession();
  }, []);

  // Setup session check interval when logged in
  useEffect(() => {
    if (isLoggedIn) {
      const interval = setInterval(checkSession, 60000); // Check every minute
      setSessionCheckInterval(interval);
      return () => {
        if (interval) clearInterval(interval);
      };
    } else if (sessionCheckInterval) {
      clearInterval(sessionCheckInterval);
      setSessionCheckInterval(null);
    }
  }, [isLoggedIn]);

  const checkSession = async () => {
    try {
      const response = await fetch('/api/session');
      const data = await response.json();
      
      if (data.isValid) {
        setIsLoggedIn(true);
        setUsername(data.user.username);
        setSessionExpiry(new Date(data.sessionExpiry));
      } else {
        handleLogout();
      }
    } catch (error) {
      console.error('Session check error:', error);
      handleLogout();
    }
  };

  const handleLogin = (username: string, expiry: Date) => {
    setIsLoggedIn(true);
    setUsername(username);
    setSessionExpiry(expiry);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggedIn(false);
      setUsername('');
      setSessionExpiry(null);
    }
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={
            !isLoggedIn ? (
              <Login onLogin={handleLogin} />
            ) : (
              <Navigate to="/Discord-Competition IV" replace />
            )
          } />
          <Route path="/Discord-Competition IV" element={
            isLoggedIn ? (
              <MainPage />
            ) : (
              <Navigate to="/login" replace />
            )
          } />
          <Route path="/" element={
            <Navigate to={isLoggedIn ? "/Discord-Competition IV" : "/login"} replace />
          } />
        </Routes>
      </div>
    </Router>
  );
}

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#f8f9fa',
    borderBottom: '1px solid #dee2e6',
  },
  userInfo: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
  },
  sessionTimer: {
    fontSize: '0.9rem',
    color: '#666',
  },
  logoutButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
  },
};

export default App;
