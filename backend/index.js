const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'uploads')));

// API Routes
const encodeRoute = require('./routes/encode');
const decodeRoute = require('./routes/decode');

app.use('/api', encodeRoute);
app.use('/api', decodeRoute);

// Serve frontend build files
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Catch all handler for frontend routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
