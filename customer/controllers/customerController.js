const Customer = require('../model/model'); // Import the Customer model


const jwt = require('jsonwebtoken');

// Secret key for JWT (this should ideally be stored in an environment variable)

const JWT_SECRET = 'your_jwt_secret';
///
const {
  createContact,
  startConversation,
} = require('../utils/intercom');
///


// Controller to add a customer
exports.addCustomer = async (req, res) => {
  // const { name, phone, category, description, comments, response } = req.body;
  const { name, phone, category, description, comments } = req.body;
  const response='Your request has been received. Our team will respond shortly.';

  try {
    // Verify JWT and extract userId from token
    const token = req.header('Authorization')?.split(' ')[1];  // Bearer <token>
    if (!token) return res.status(401).json({ message: 'Authorization token is required' });

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;  // Extracted userId from JWT

    // Create a new customer with the userId stored as part of the customer
    const newCustomer = new Customer({
      userId,
      name,
      phone,
      category,
      description,
      comments,
      response,
      
    });
  console.log('====================================');
  console.log(newCustomer);
  console.log('====================================');
    await newCustomer.save();

     // 🧠 INTERCOM INTEGRATION
     const contactId = await createContact({ name, phone });
     const conversationId = await startConversation(contactId, `[${category}] ${description}`);
     console.log(`Calling Integration while adding customer Convoid: ${conversationId}`);
     newCustomer.conversationId = conversationId;
     await newCustomer.save();

 
     // Optionally store conversationId in DB later if needed
     console.log(`Intercom conversation started: ${conversationId}`);
 

    res.status(201).json({ message: 'Customer added successfully', customer: newCustomer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Controller to delete a customer based on userId
exports.deleteCustomer = async (req, res) => {
    const { id } = req.params;
    // Extracted userId from JWT
  try {
    // Check if the customer exists
    const customer = await Customer.findByIdAndDelete(id);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Controller to get customer details based on userId
exports.getCustomerDetails = async (req, res) => {
  // const { userId } = req.params;
  // const token = userId;  // Bearer <token>
  // if (!token) return res.status(401).json({ message: 'Authorization token is required' });

  // const decoded = jwt.verify(token, JWT_SECRET);

  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Authorization token is required' });

  const decoded = jwt.verify(token, JWT_SECRET);
  const userId = decoded.id;  // Extracted userId from JWT
  console.log(userId);
  
  try {
    const customer = await Customer.find({ userId:userId });

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json({ customer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
