const express = require('express');
const cors = require('cors'); 
require('dotenv').config();

// Initialize Express app
const app = express();

// --- 1. CRITICAL MIDDLEWARES ---
// Controls which frontend domains can talk to this server
const allowedOrigins = [
    'http://localhost:3000',
    process.env.CLIENT_URL  // Your deployed frontend URL (set in Render env vars)
].filter(Boolean);

app.use(cors({ origin: allowedOrigins }));
// This makes the 'uploads' folder publicly viewable
app.use('/uploads', express.static('uploads')); 
// Allows the server to read JSON data (like your login credentials)
app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: true }));

// --- 2. DATABASE CONNECTION ---
const connectDB = require('./config/db'); 
connectDB();

// --- 3. DEFINE ROUTES ---
// This connects the frontend URLs to your specific backend route files
app.use('/api/auth', require('./routes/auth'));         // For the Login page
app.use('/api/resources', require('./routes/resource')); // For the Upload page

// --- 4. GLOBAL ERROR HANDLER ---
// Catches unhandled errors so the server doesn't crash
app.use((err, req, res, next) => {
    console.error('Server Error:', err.message);
    
    // Handle multer file-type errors
    if (err.message === 'Only PDF and DOC/DOCX files are allowed') {
        return res.status(400).json({ msg: err.message });
    }
    
    // Handle multer file-size errors
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ msg: 'File too large. Maximum size is 10MB.' });
    }

    res.status(500).json({ msg: 'Something went wrong on the server.' });
});

// --- 5. START THE SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));