const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const connectToMongoDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/hostel_management');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

connectToMongoDB();

// Import routes
const userRoutes = require('./routes/users');
const groupRoutes = require('./routes/groups');

// Routes
app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 