
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const customerRoutes = require('./routes/customerRoutes'); // Import routes
const run =require('./scripts/fetchReplies')
const connectDB = require('./config/db');
const cron = require('node-cron');


const app = express();
const PORT = process.env.PORT || 3001;

connectDB();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/customer', customerRoutes);
// cron.schedule('*/40 * * * * *', () => {
//     console.log('🕒 Cron job started. Running every 40 seconds...');

//     run();
//   });
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
