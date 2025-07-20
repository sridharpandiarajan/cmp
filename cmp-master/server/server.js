const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS for Vercel frontend
app.use(cors({
  origin: ['https://workermanagementsystem.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Connected to MongoDB');
  app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
})
.catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ API routes
const workerRoutes = require('./routes/Workers');
app.use('/api/workers', workerRoutes);

// ✅ Root test endpoint
app.get('/', (req, res) => res.send('🌐 CMP Worker API running'));

// ✅ 404 handler
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));
