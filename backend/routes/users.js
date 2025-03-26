const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Create a new user
router.post('/', async (req, res) => {
  try {
    console.log('Received user data:', req.body);
    const user = new User(req.body);
    const savedUser = await user.save();
    console.log('Saved user to database:', savedUser);
    res.status(201).json(savedUser);
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(400).json({ message: error.message });
  }
});

// Login validation
router.post('/login', async (req, res) => {
  try {
    const { registrationNumber, dateOfBirth } = req.body;
    
    // First check if user exists in MongoDB
    let user = await User.findOne({ registrationNumber });

    // If user doesn't exist in MongoDB, we'll still allow login if the registration number exists
    // This way, we can create the user record when they first log in
    if (!user) {
      // Return success with user data from request
      // The frontend will handle creating the user record
      return res.json({
        success: true,
        user: {
          name: req.body.name || '',
          registrationNumber: registrationNumber,
          gender: req.body.gender || '',
          course: req.body.course || '',
          year: req.body.year || '3',
          rank: req.body.rank || 0,
          dateOfBirth: new Date(dateOfBirth)
        }
      });
    }

    // If user exists, validate DOB
    const userDOB = user.dateOfBirth.toISOString().split('T')[0];
    const providedDOB = new Date(dateOfBirth).toISOString().split('T')[0];

    if (userDOB !== providedDOB) {
      return res.status(401).json({ message: 'Invalid date of birth' });
    }

    res.json({
      success: true,
      user: {
        name: user.name,
        registrationNumber: user.registrationNumber,
        gender: user.gender,
        course: user.course,
        year: user.year,
        rank: user.rank,
        dateOfBirth: user.dateOfBirth
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user by registration number
router.get('/:registrationNumber', async (req, res) => {
  try {
    const user = await User.findOne({ registrationNumber: req.params.registrationNumber });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 