const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const crypto = require('crypto');
const Customer = require('../model/model');


// Route to add a new customer
router.post('/add', customerController.addCustomer);

// Route to delete a customer based on userId
router.delete('/delete/:id', customerController.deleteCustomer);

// Route to view customer details based on userId
// router.get('/view/:userId', customerController.getCustomerDetails);

router.get('/view', customerController.getCustomerDetails);

// Intercom webhook handler
router.post('/intercom-webhook', async (req, res) => {
    // 1. Verify HMAC signature
    const signature = req.headers['x-intercom-signature'];
    const secret = process.env.INTERCOM_WEBHOOK_SECRET;
    const hmac = crypto.createHmac('sha256', secret)
                       .update(JSON.stringify(req.body))
                       .digest('hex');
  
    if (hmac !== signature) {
      return res.status(401).send("Unauthorized");
    }
  
    // 2. Process the event
    const event = req.body;
    console.log('Webhook Payload:', JSON.stringify(event, null, 2)); // Debug
    // Handle Intercom's test event
    if (event.type === 'ping') {
        return res.status(200).json({ message: 'Pong!' });
    }

  
    // Handle agent replies
    // if (event.topic === 'conversation.admin.replied') {
    //     console.log('entering event agent handler');
        
    //   const conversationId = event.data.item.id;
    //   const agentReply = event.data.item.conversation_parts.conversation_parts[0]?.body;
    //   console.log(conversationId);
    //   console.log(agentReply);
        
  
    //   // 3. Update the customer's response in MongoDB
    //   try {
    //     await Customer.findOneAndUpdate(
    //       { conversationId },
    //       { $set: { response: agentReply } }
    //     );
    //     res.sendStatus(200);
    //   } catch (err) {
    //     console.error('Webhook DB update failed:', err);
    //     res.sendStatus(500);
    //   }
    // } else {
    //   res.sendStatus(200); // Ignore other events
    // }
    if (req.body.topic === 'conversation.admin.replied') {
        const event = req.body;
        console.log('Webhook Payload:', JSON.stringify(event, null, 2));
    
        // Extract Critical Data
        const conversationId = event.data.item.id; // CORRECT conversation ID
        const conversationParts = event.data.item.conversation_parts?.conversation_parts || [];
    
        // Find LATEST admin reply
        const adminReplies = conversationParts
          .filter(part => part.author?.type === 'admin')
          .sort((a, b) => b.created_at - a.created_at);
    
        if (adminReplies.length > 0) {
          const latestReply = adminReplies[0].body;
    
          // 4. Update Database
          try {
            await Customer.findOneAndUpdate(
              { conversationId }, // Match using stored conversationId
              { $set: { response: latestReply } },
              { new: true }
            );
            console.log(`✅ Updated response for conversation ${conversationId}`);
            return res.sendStatus(200);
          } catch (err) {
            console.error('Database update error:', err);
            return res.status(500).send("DB update failed");
          }
        }
      }
    
      res.sendStatus(200); // Ack other events

  });


module.exports = router;
