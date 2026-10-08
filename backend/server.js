// Global Tap backend.
// Setup: copy .env.example to .env and fill it in, then run:
//   npm install
//   node server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:8000' }));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));

app.listen(PORT, () => {
  console.log('Global Tap backend running on port ' + PORT);
});
