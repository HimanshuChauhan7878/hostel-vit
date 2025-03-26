const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  leader: {
    registrationNumber: { type: String, required: true },
    rank: { type: Number, required: true }
  },
  members: [{
    registrationNumber: { type: String, required: true },
    rank: { type: Number, required: true }
  }],
  roomPreferences: [{
    key: { type: String, required: true },
    value: { type: String, required: true }
  }],
  submissionDate: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
});

module.exports = mongoose.model('Group', groupSchema); 