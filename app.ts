const express = require('express');
// const db  = require('./config/db');
const referralRoutes = require('./src/routes/referralRoutes');
const cookieParser = require('cookie-parser');
const path = require('path');
const mongoose = require('mongoose')

const app = express();

// Database connection
const connectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGODB_URI as string);
      console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  };

connectDB();

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Use cookie-parser middleware
app.use(cookieParser());

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', referralRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


