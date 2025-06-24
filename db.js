// db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  // Only connect Atlas when NOT in test
  if (process.env.NODE_ENV !== 'test') {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  }
};

module.exports = connectDB;
