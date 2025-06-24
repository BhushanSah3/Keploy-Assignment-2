require('dotenv').config();
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const express = require('express');
const connectDB = require('./db');
const studentRoutes = require('./routes/studentRoutes');

const app = express();
app.use(express.json());

// Connect (Atlas or skip in test)
connectDB();

app.use('/api/students', studentRoutes);

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
