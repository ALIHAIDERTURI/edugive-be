const express = require('express');
const passport = require('passport');
const { register, login, googleCallback, facebookCallback } = require('../controllers/authController');

const router = express.Router();

// Register a user
router.post('/register', register);

// Login a user
router.post('/login', login);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/auth/login' }), googleCallback);

// Facebook OAuth
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/auth/login' }), facebookCallback);

module.exports = router;
