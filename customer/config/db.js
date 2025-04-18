const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // await mongoose.connect(process.env.MONGO_URI);
        if (mongoose.connection.readyState !== 1) {
                await mongoose.connect(process.env.MONGO_URI);
            }
        mongoose.connection.on('connected', () => {
            console.log(`✅ MongoDB ➜ ${mongoose.connection.host}/${mongoose.connection.name}`);
          });
          
        console.log('MongoDB Connected to Customer');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
  