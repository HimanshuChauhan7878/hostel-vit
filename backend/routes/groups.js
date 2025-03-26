const express = require('express');
const router = express.Router();
const Group = require('../models/Group');

// Create a new group
router.post('/', async (req, res) => {
  try {
    console.log('Received group data:', req.body);
    
    // Check if user already has a group
    const existingGroup = await Group.findOne({
      'leader.registrationNumber': req.body.leader.registrationNumber
    });

    if (existingGroup) {
      return res.status(400).json({ 
        message: 'User already has a group. Please delete the existing group first.' 
      });
    }

    const group = new Group(req.body);
    console.log('Created group model:', group);
    const savedGroup = await group.save();
    console.log('Saved group to database:', savedGroup);
    res.status(201).json(savedGroup);
  } catch (error) {
    console.error('Error saving group:', error);
    res.status(400).json({ message: error.message });
  }
});

// Get all groups
router.get('/', async (req, res) => {
  try {
    const groups = await Group.find();
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get latest group by leader's registration number
router.get('/leader/:registrationNumber', async (req, res) => {
  try {
    const group = await Group.findOne({ 
      'leader.registrationNumber': req.params.registrationNumber 
    });
    
    if (!group) {
      return res.status(404).json({ message: 'No group found for this user' });
    }
    
    res.json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get group by member's registration number
router.get('/member/:registrationNumber', async (req, res) => {
  try {
    const group = await Group.findOne({
      'members.registrationNumber': req.params.registrationNumber
    });
    
    if (!group) {
      return res.status(404).json({ message: 'No group found for this user' });
    }
    
    res.json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update group status
router.patch('/:id/status', async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    group.status = req.body.status;
    await group.save();
    res.json(group);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 