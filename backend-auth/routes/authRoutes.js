const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const router = express.Router();

router.post('/register', async (req, res) => {
    const { email, password, name } = req.body;

    if (!email || !password || !name) return res.status(400).json({ msg: 'All fields are required' });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: hashedPassword, name });

    res.status(201).json({ msg: 'User registered', user: newUser });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ msg: 'All fields are required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = generateToken(user._id);
    res.json({ msg: 'Login successful', token });
});

// Google OAuth Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    const user = req.user;
    // console.log(user);
    const token = generateToken(user._id);  
    console.log(process.env.FRONTEND_URL);
    
    res.redirect(`${process.env.FRONTEND_URL}/home?token=${token}`);
    // res.redirect('http://localhost:5173/home');

});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ msg: 'Logout failed' });
        res.clearCookie('connect.sid'); // Clears session cookie
        res.json({ msg: 'Logged out successfully' });
    });
});

module.exports = router;
