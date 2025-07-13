const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));

const workerRoutes = require('./routes/Workers');
app.use('/api/workers', workerRoutes);

app.get('/', (req, res) => res.send('🌐 CMP Worker API running'));

// Optional: Catch-all route for undefined endpoints
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));
