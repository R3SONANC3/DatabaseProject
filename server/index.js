const express = require('express');
const cors = require('cors');
const { initMySQL } = require('./config');
const { corsOptions } = require('./middleware');
const authRoutes = require('./routes/auth');
const getData = require('./routes/data')
const getUser = require('./routes/user')
const emailRoutes = require('./routes/email');
const morgan = require('morgan')

const app = express();

app.use(express.json()); 

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(morgan('dev'));

const API_PORT = process.env.PORT || 8000;

app.use('/api/auth', authRoutes); 
app.use('/api/data', getData);
app.use('/api/user', getUser)
app.use('/api/email', emailRoutes);

// Basic error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Internal Server Error',
    error: err.message,
  });
});

// Initialize MySQL and start server
app.listen(API_PORT, '0.0.0.0' ,async () => {
  try {
    await initMySQL();
    console.log(`Server running on port ${API_PORT}`);
  } catch (error) {
    console.error('Failed to initialize MySQL:', error);
    process.exit(1); // Exit the process with failure
  }
});

module.exports = app;