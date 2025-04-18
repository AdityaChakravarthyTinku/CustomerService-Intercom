
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const session = require('express-session');
const passport = require('./config/passport');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);
app.use('/user', userRoutes);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
