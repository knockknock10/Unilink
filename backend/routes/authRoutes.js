import express from 'express';
import { check } from 'express-validator';
import { registerUser, loginUser } from '../controllers/authController.js';

const router = express.Router();

router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  ],
  registerUser
);

router.post('/login', loginUser);

export default router;
