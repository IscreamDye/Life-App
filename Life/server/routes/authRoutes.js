// authRoutes.js

import express from 'express';
import cors from 'cors';

import { test,  registerUser, loginUser, 
getProfile, 
  logoutUser 
} from '../controllers/authControllers.js';

const router = express.Router();

// Allow requests only from this origin
router.use(
  cors({
    credentials: true,
    origin: 'https://lifestatisticsapp.netlify.app/',
  })
);

// Define routes
router.get('/', test);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', getProfile);
router.post('/logout', logoutUser);

// Export router for use in server
export default router;
