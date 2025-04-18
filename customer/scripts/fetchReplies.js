require('dotenv').config();
const mongoose = require('mongoose');
const Customer = require('../model/model');
const { fetchLatestAgentReply } = require('../utils/intercom');

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const pending = await Customer.find({
      conversationId: { $ne: null },
      response: { $in: ['Waiting for agent response...', 'Your request has been received. Our team will respond shortly.'] },
    });

    for (let customer of pending) {
      try {
        const reply = await fetchLatestAgentReply(customer.conversationId);
        console.log(reply);
        if (reply) {
          customer.response = reply;
          await customer.save();
          console.log(`✅ Updated response for ${customer._id} for conversation:${customer.conversationId}`);
        } else {
          console.log(`⏳ No agent reply yet for ${customer._id} for conversation:${customer.conversationId}`);
        }
      } catch (err) {
        console.error(`❌ Error for ${customer._id}:`, err.message);
      }
    }

  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
  }
};
 module.exports = run;
