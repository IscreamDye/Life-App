// controllers/authControllers.js

import User from '../models/user.js';
import { hashPassword, comparePassword } from '../helpers/auth.js';
import jwt from 'jsonwebtoken';

// Test endpoint
const test = (req, res) => {
  res.json('test is working');
};

// Register new user
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username) {
      return res.json({ error: 'username is required' });
    }
    if (!password || password.length < 6) {
      return res.json({ error: 'more than 6 chars' });
    }

    const exist = await User.findOne({ email });
    if (exist) {
      return res.json({ error: 'email taken' });
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return res.json(user);
  } catch (error) {
    console.log(error);
  }
};

// Login existing user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ error: 'no user found' });
    }

    const match = await comparePassword(password, user.password);

    if (match) {
      jwt.sign(
        { email: user.email, id: user._id, username: user.username },
        process.env.JWT_SECRET,
        {},
        (err, token) => {
          if (err) throw err;
          res.cookie('token', token).json(user);
        }
      );
    } else {
      res.json({ error: 'passwords dont match' });
    }
  } catch (error) {
    console.log(error);
  }
};

// Get user profile from token
const getProfile = (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
      if (err) throw err;
      res.json(user);
    });
  } else {
    res.json(null);
  }
};

// Logout
const logoutUser = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
};

// Middleware to protect routes
const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) throw new Error();

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Export all functions
export {
  test,
  registerUser,
  loginUser,
  getProfile,
  logoutUser,
  authMiddleware,
};