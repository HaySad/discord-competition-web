import React, { useState } from 'react';

interface LoginProps {
  onLogin: (username: string, sessionExpiry: Date) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setMessage('กรุณาใส่ชื่อผู้ใช้ / Please enter a username');
      return;
    }

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        onLogin(data.username, new Date(data.sessionExpiry));
      } else {
        setMessage('เกิดข้อผิดพลาด กรุณาลองใหม่ / Error occurred, please try again');
      }
    } catch (error) {
      setMessage('เกิดข้อผิดพลาด กรุณาลองใหม่ / Error occurred, please try again');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        <h2 style={styles.title}>เข้าสู่ระบบ / Login</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="ใส่ชื่อผู้ใช้ / Enter username"
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            เข้าสู่ระบบ / Login
          </button>
        </form>
        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  loginBox: {
    padding: '2rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    textAlign: 'center' as const,
    marginBottom: '1.5rem',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
  },
  input: {
    padding: '0.75rem',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '1rem',
  },
  button: {
    padding: '0.75rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: '#0056b3',
    },
  },
  message: {
    textAlign: 'center' as const,
    marginTop: '1rem',
    color: '#dc3545',
  },
};

export default Login; 