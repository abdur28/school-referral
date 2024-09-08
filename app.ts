import express, { Application } from 'express';
import { connectDB } from './config/db';
import referralRoutes from './src/routes/referralRoutes';
import cookieParser from 'cookie-parser';
import path from 'path';

const app: Application = express();

// Database connection
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
