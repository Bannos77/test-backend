import express from 'express';
import Message from '../models/Message.js'; // Import your Mongoose model

const router = express.Router();

// GET: Retrieve all messages
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find(); // Fetch all messages from MongoDB
    res.json(messages); // Send the messages as a JSON response
  } catch (err) {
    res.status(500).json({ message: 'Error fetching messages' });
  }
});

// GET: Retrieve a specific message by ID
router.get('/:id', async (req, res) => {
  try {
    const message = await Message.findById(req.params.id); // Find the message by ID
    if (message) {
      res.json(message); // Send the message as a JSON response
    } else {
      res.status(404).json({ message: 'Message not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error fetching message' });
  }
});

// POST: Add a new message
router.post('/', async (req, res) => {
  console.log(req.body);
  const newMessage = new Message(req.body); // Create a new message with the request body
  try {
    const savedMessage = await newMessage.save(); // Save the message to MongoDB
    res.status(201).json({ message: 'Message added successfully!', messageData: savedMessage });
  } catch (err) {
    res.status(400).json({ message: 'Error saving message', error: err.message });
  }
});

// PUT: Update an existing message
router.put('/:id', async (req, res) => {
  try {
    const updatedMessage = await Message.findByIdAndUpdate(req.params.id, req.body, { new: true }); // Update the message
    if (updatedMessage) {
      res.json({ message: `Message with id ${req.params.id} updated successfully!`, messageData: updatedMessage });
    } else {
      res.status(404).json({ message: 'Message not found!' });
    }
  } catch (err) {
    res.status(400).json({ message: 'Error updating message', error: err.message });
  }
});

// DELETE: Delete an existing message
router.delete('/:id', async (req, res) => {
  try {
    const deletedMessage = await Message.findByIdAndDelete(req.params.id); // Delete the message by ID
    if (deletedMessage) {
      res.json({ message: 'Message deleted successfully!' });
    } else {
      res.status(404).json({ message: 'Message not found!' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error deleting message', error: err.message });
  }
});

export default router;
