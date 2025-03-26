const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  registrationNumber: { type: String, required: true, unique: true },
  gender: { type: String, required: true },
  course: { type: String, required: true },
  year: { type: Number, required: true },
  rank: { type: Number, required: true },
  dateOfBirth: { type: Date, required: true, default: new Date('1111-01-01') }, // Default DOB for all students
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema); 