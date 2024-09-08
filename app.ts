const express = require('express');
const db  = require('./config/db');
const referralRoutes = require('./src/routes/referralRoutes');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();

// Database connection
db.connectDB();

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


