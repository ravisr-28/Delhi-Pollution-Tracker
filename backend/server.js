import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import aqiRoutes from './routes/aqiRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection with better error handling
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
})
.then(async () => {
  console.log('✅ MongoDB connected successfully');
  
  // Start cron jobs only after DB connection is established
  await import('./cron/aqiFetcher.js');
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  console.error('Make sure MongoDB is running or check your MONGODB_URI');
  process.exit(1);
});

// Connection event listeners
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/aqi', aqiRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Delhi Pollution Tracker API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});