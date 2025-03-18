const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const session = require('express-session');
const db = require('./database');
const app = express();

// Session configuration
app.use(session({
  secret: 'maimai-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 1000 // 1 hour
  }
}));

app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'build')));
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to check session
const checkSession = (req, res, next) => {
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized', sessionExpired: true });
  }
};

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { username } = req.body;
  
  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    const userExists = await db.findUser(username);
    if (!userExists) {
      await db.addUser(username);
    }
    
    // Set session data
    req.session.user = {
      username,
      loginTime: new Date(),
    };
    
    res.json({ 
      success: true, 
      username,
      sessionExpiry: new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Logout endpoint
app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Could not log out' });
    }
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

// Check session status
app.get('/api/session', (req, res) => {
  if (req.session && req.session.user) {
    res.json({
      isValid: true,
      user: req.session.user,
      sessionExpiry: req.session.cookie.expires
    });
  } else {
    res.json({ isValid: false });
  }
});

// Get all users endpoint (protected)
app.get('/api/users', checkSession, async (req, res) => {
  try {
    const users = await db.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete user endpoint (protected)
app.delete('/api/users/:username', checkSession, async (req, res) => {
  const { username } = req.params;
  try {
    const success = await db.deleteUser(username);
    if (success) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Download song endpoint (protected)
app.get('/api/songs/:songId/download', checkSession, (req, res) => {
  const { songId } = req.params;
  const songPath = path.join(__dirname, 'public/songs', songId, 'song.zip');

  if (!fs.existsSync(songPath)) {
    return res.status(404).json({ error: 'Song not found' });
  }

  res.download(songPath);
});

// Get all tiers data (protected)
app.get('/api/tiers', checkSession, async (req, res) => {
  try {
    const tiersData = await fs.readFile(path.join(__dirname, 'data/tiers/tiers.json'), 'utf8');
    const { tiers } = JSON.parse(tiersData);
    res.json(tiers);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Catch all other routes and return the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 