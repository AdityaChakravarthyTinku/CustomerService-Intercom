const libPhone = require('libphonenumber-js'); 
const axios = require('axios');

// Intercom base config
const INTERCOM_BASE_URL = 'https://api.intercom.io';
const INTERCOM_TOKEN = process.env.INTERCOM_ACCESS_TOKEN;

const intercomClient = axios.create({
  baseURL: INTERCOM_BASE_URL,
  headers: {
    Authorization: `Bearer ${INTERCOM_TOKEN}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }
});
/**
 * Return E.164 phone or null
 */
const formatPhone = (raw) => {
  const p = libPhone.parsePhoneNumberFromString(raw, 'IN'); // default to India
  return p?.isValid() ? p.format('E.164') : null;
};
/**
 * Create a contact in Intercom
 * Uses phone as external_id if email is not present
 */
// const createContact = async ({ name, phone }) => {
//   try {
//     const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`; // Assuming India here

//     const response = await intercomClient.post('/contacts', {
//       role: 'user',
//       name,
//       phone: formattedPhone,
//       external_id: phone, // fine to keep unformatted as unique ID
//     });

//     return response.data.id; // return Intercom contact ID
//   } catch (err) {
//     console.error('❌ Failed to create Intercom contact:', err.response?.data || err.message);
//     throw err;
//   }
// };

/**
 * Create–or–fetch a contact in Intercom.
 * Returns the contact ID even if the contact already exists.
 */
const createContact = async ({ name, phone, email }) => {
  // ---------- build payload ----------
  const body = { role: 'user', name };

  // phone → E.164
  const e164 = phone ? formatPhone(phone) : null;
  if (e164) body.phone = e164;

  // at least one unique identifier
  if (email) body.email = email;
  else body.external_id = phone || Date.now().toString();

  // ---------- send request ----------
  try {
    const { data } = await intercomClient.post('/contacts', body);
    return data.id;                                    // created OK (201)
  } catch (err) {
    const status = err.response?.status;

    /* ---------- 409 = already exists ---------- */
    if (status === 409) {
      // Intercom helpfully returns the id in the error message:
      // "A contact matching those details already exists with id=xxxxxxxx"
      const msg   = err.response.data.errors?.[0]?.message || '';
      const match = msg.match(/id=([a-f0-9]+)/i);
      if (match) return match[1];

      // Fallback – look up by phone / email / external_id
      const query = email
        ? `email=${encodeURIComponent(email)}`
        : `external_id=${encodeURIComponent(body.external_id)}`;
      const { data } = await intercomClient.get(`/contacts?${query}`);
      if (data?.data?.[0]?.id) return data.data[0].id;
    }

    // ---------- anything else = real error ----------
    console.error('❌ Failed to create/get Intercom contact:',
                  err.response?.data || err.message);
    throw err;
  }
};


/**
 * Start a conversation with the contact
 */
// const startConversation = async (contactId, message) => {
//   try {
//     const response = await intercomClient.post('/messages', {
//       message_type: 'inapp',
//       body: message,
//       from: {
//         type: 'admin',
//         id: 8272868  // Replace this with a real admin ID from your Intercom workspace
//       },
//       to: {
//         type: 'contact',
//         id: contactId
//       }
//     });
//     return response.data.conversation_id;
//   } catch (err) {
//     console.error('❌ Failed to start Intercom conversation:', err.response?.data || err.message);
//     throw err;
//   }
// };


// const startConversation = async (contactId, body) => {
//   try {
//     /*  create the thread via /messages  */
//     const { data } = await intercomClient.post('/conversations', {
//       message_type: 'inapp',
//       body,
//       from: { type: 'admin', id: 8272868 },   // your teammate id
//       to:   { type: 'contact', id: contactId }
//     });

//     /*  store the real conversation id  */
//     console.log(data);
//     // console.log(`In fetch Latest: this is convoid wr:${conversationId}`);

//     return data.conversation_id||data.conversation?.id|| data.conversation?.ID;              // NOT  data.id
//   } catch (err) {
//     console.error('❌ startConversation failed:',
//                   err.response?.data || err.message);
//     throw err;
//   }
// };


//WORKING::
// const startConversation = async (contactId, body) => {
//   // 1. send admin → contact message
//   const { data: msg } = await intercomClient.post('/messages', {
//     message_type : 'inapp',
//     body,
//     from : { type:'admin',  id: 8272868 },
//     to   : { type:'contact', id: contactId }
//   });

//   // 2. immediately look up that message to get the conversation_id
//   const { data: fullMsg } = await intercomClient.get(`/messages/${msg.id}`);
//   return fullMsg.conversation_id;           // <-- guaranteed
// };

// Replace startConversation with:
// const startConversation = async (contactId, body) => {
//   try {
//     const { data } = await intercomClient.post('/conversations', {
//       from: { type: 'admin', id: '8272868' }, // Your admin ID
//       to: { type: 'contact', id: contactId },
//       body: body
//     });
//     return data.id; // Direct conversation ID
//   } catch (err) {
//     console.error('Failed to start conversation:', err.response?.data || err.message);
//     throw err;
//   }
// };

const startConversation = async (contactId, body) => {
  try {
    // Directly create a conversation
    const { data } = await intercomClient.post('/conversations', {
      from: { type: 'admin', id: '8272868' }, // Your admin ID
      to: { type: 'contact', id: contactId },
      body: body
    });
    return data.id; // This is the conversation ID
  } catch (err) {
    console.error('Failed to start conversation:', err.response?.data || err.message);
    throw err;
  }
};

/**
 * Fetch the latest reply from an admin in a conversation
 */
const fetchLatestAgentReply = async (conversationId) => {
  try {
    console.log(`In fetch Latest: this is convoid:${conversationId}`);
    const response = await intercomClient.get(`/conversations/${conversationId}`);
    const parts = response.data.conversation_parts?.conversation_parts || [];

    // Get latest admin reply
    const latestReply = parts.reverse().find(p => p.author?.type === 'admin');
    return latestReply ? latestReply.body : null;
  } catch (err) {
    console.error(`❌ Failed to fetch Intercom reply for conversation ${conversationId}:`, err.response?.data || err.message);
    return null;
  }
};

module.exports = {
  createContact,
  startConversation,
  fetchLatestAgentReply
};

// const axios = require('axios');

// const INTERCOM_BASE_URL = 'https://api.intercom.io';
// const INTERCOM_TOKEN = process.env.INTERCOM_ACCESS_TOKEN;

// const intercomClient = axios.create({
//   baseURL: INTERCOM_BASE_URL,
//   headers: {
//     Authorization: `Bearer ${INTERCOM_TOKEN}`,
//     'Content-Type': 'application/json',
//     Accept: 'application/json',
//   }
// });

// // const createContact = async ({ name, phone }) => {
// //   const res = await intercomClient.post('/contacts', {
// //     role: 'user',
// //     name,
// //     phone
// //   });
// //   return res.data.id;
// // };

// exports.createContact = async ({ name, phone }) => {
//   try {
//     const response = await axios.post(
//       'https://api.intercom.io/contacts',
//       {
//         role: 'user',
//         name,
//         phone,
//         external_id: phone // using phone as unique ID if email is not used
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${INTERCOM_TOKEN}`,
//           'Content-Type': 'application/json',
//           Accept: 'application/json',
//         },
//       }
//     );
//     return response.data.id; // return the Intercom contact ID
//   } catch (err) {
//     console.error('❌ Failed to create Intercom contact:', err.response?.data || err.message);
//     throw err;
//   }
// };
// const startConversation = async (contactId, message) => {
//   const res = await intercomClient.post('/messages', {
//     message_type: 'inapp',
//     body: message,
//     from: {
//       type: 'contact',
//       id: contactId
//     }
//   });
//   return res.data.conversation_id;
// };

// const fetchLatestAgentReply = async (conversationId) => {
//   const res = await intercomClient.get(`/conversations/${conversationId}`);
//   const parts = res.data.conversation_parts?.conversation_parts || [];

//   // Get latest admin reply
//   const reply = parts.reverse().find(p => p.author?.type === 'admin');
//   return reply ? reply.body : null;
// };

// module.exports = {
//   createContact,
//   startConversation,
//   fetchLatestAgentReply
// };