const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
require('dotenv').config();

// Middleware to parse JSON
app.use(express.json());
app.use(cors());

// Connect to MongoDB Atlas cluster
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
// Log MongoDB URI
console.log("MongoDB URI console:", process.env.MONGODB_URI);
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
    res.status(400).send(error);
  }
});

app.get('/', (req, res) => {
    res.send('Server is running.');
  });
  
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
