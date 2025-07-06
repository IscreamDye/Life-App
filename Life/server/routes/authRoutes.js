// authRoutes.js

import express from 'express';
import cors from 'cors';

import { test,  registerUser, loginUser, 
getProfile, 
  logoutUser 
} from '../controllers/authControllers.js';

const router = express.Router();



// Define routes
router.get('/', test);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', getProfile);
router.post('/logout', logoutUser);

// Export router for use in server
export default router;
