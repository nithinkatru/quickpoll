const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dns').setServers(['8.8.8.8']); // Google's public DNS
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5050; // ✅ Changed from 5000 to 5050

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running ✅');
});

const pollRoutes = require('./routes/polls');
app.use('/api/polls', pollRoutes);
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
