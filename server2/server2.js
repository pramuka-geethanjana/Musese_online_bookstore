const WebSocket = require('ws');
const mongoose = require('mongoose');
const port = 3000;
require('dotenv').config();
const axios = require('axios');

// Define the Mongoose schema and model (as defined previously)
const contactUsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, match: [/.+\@.+\..+/, "Please fill a valid email address"] },
  message: { type: String, required: true },
  creationDate: { type: Date, default: Date.now }
});

const ContactUs = mongoose.model('contact', contactUsSchema);

// Function to save contact data
async function saveContactData(data) {
  try {
    const contactMessage = new ContactUs(data);
    const savedMessage = await contactMessage.save();
    
    const response = await postContactData(data);
    console.log('Contact message saved:', savedMessage);
  } catch (error) {
    console.error('Error saving contact message:', error);
  }
}

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected...');

    // Start WebSocket server after successful database connection
    const wss = new WebSocket.Server({ port });

    wss.on('connection', function connection(ws) {
      console.log('A new client connected.');

      ws.on('message', async function incoming(message) {
        console.log('Received: %s', message);

        try {
          const contactData = JSON.parse(message);
          console.log('Contact data:', contactData);

          await saveContactData(contactData);

        } catch (e) {
          console.error('Error:', e);
        }
      });

      ws.on('close', function close() {
        console.log('Client disconnected.');
      });

      ws.send('Hello Client, connection established!');
    });

    console.log(`WebSocket server running at ws://localhost:${port}/`);
  })
  .catch(err => console.error('MongoDB connection error:', err));

  async function postContactData(data) {
    try {
      const url = 'http://supermarketweb.online/message.php'; 
      return await axios.post(url, data);
    } catch (error) {
      console.error('Error in POST request:', error);
      throw error;
    }
  }