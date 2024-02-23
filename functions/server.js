const functions = require('firebase-functions');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(express.json()); // Middleware to parse JSON
app.use(cors()); // Enable CORS

// MongoDB connection
const mongoUri = functions.config().mongodb?.uri; // Safely access the MongoDB URI
if (!mongoUri) {
  functions.logger.error('MongoDB URI is not defined in Firebase config.');
  process.exit(1); // Exit if the MongoDB URI is not set
}

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => functions.logger.log('MongoDB connected'))
  .catch(err => functions.logger.error('MongoDB connection error:', err));

// Define a schema
const formSchema = new mongoose.Schema({
  email: String,
  childAgeRange: String,
  serviceInterest: String,
  currentSupport: String,
  challenges: String,
  supportExpectations: String,
  healthChallenge: String,
  feedback: String
});

// Create a model
const Form = mongoose.model('Form', formSchema);

// Route for form submission
app.post('/submit-form', async (req, res) => {
  try {
    const formData = new Form(req.body);
    await formData.save();
    res.status(201).send('Form data saved');
  } catch (error) {
    functions.logger.error('Form submission error:', error);
    res.status(400).send(error.message);
  }
});

app.get('/', (req, res) => {
  res.send('Server is running.');
});

// Expose Express API as a single Cloud Function with specified region
exports.api = functions.region('us-west2').https.onRequest(app);
