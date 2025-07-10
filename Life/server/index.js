import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/authRoutes.js';
import counterRoutes from './routes/counterRoute.js';
import noteRoute from './routes/noteRoute.js'
import chartRoute from './routes/chartRoute.js'


dotenv.config();

const allowedOrigins = [process.env.FRONTEND_URL]; 
const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Connection failed:', err));

// Middleware
app.use(cors({ origin: 'https://life-app-front.onrender.com', credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/', authRoutes);
app.use('/tracker', counterRoutes);
app.use('/tracker', noteRoute);
app.use('/tracker', chartRoute);

// Start server
const port = process.env.PORT || 4000 
app.listen(port, () => console.log(`Server running on port ${port}`));
