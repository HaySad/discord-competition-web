# Simple React Login System

A simple React application with TypeScript that implements a basic login system using a text file as a database.

## Features
- Simple login system
- Username-only authentication
- Persistent storage using text file
- Bilingual support (Thai/English)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. In a separate terminal, start the backend server:
```bash
node server.js
```

The application will be running at http://localhost:3000, and the backend server will be running at http://localhost:3001.

## How it works
- Users can enter their username to log in
- If the username doesn't exist, it will be automatically created
- All usernames are stored in users.txt
- The system is bilingual (Thai/English)
