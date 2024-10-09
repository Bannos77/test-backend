import express from 'express';
import User from '../models/User.js'; // Import your Mongoose model

const router = express.Router();

// GET: Retrieve all users
router.get('/', async (req, res) => {
  try {
    const user = await User.find(); // Fetch all users from MongoDB
    res.json(user); // Send the users as a JSON response
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// GET: Retrieve a specific user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id); // Find the user by ID
    if (user) {
      res.json(user); // Send the user as a JSON response
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user' });
  }
});

// POST: Add a new user
router.post('/', async (req, res) => {
  console.log(req.body);
  const newUser = new User(req.body); // Create a new user with the request body
  try {
    const savedUser = await newUser.save(); // Save the user to MongoDB
    res.status(201).json({ message: 'User added successfully!', userData: savedUser });
  } catch (err) {
    res.status(400).json({ message: 'Error saving user', error: err.message });
  }
});

// PUT: Update an existing user
router.put('/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }); // Update the user
    if (updatedUser) {
      res.json({ message: `User with id ${req.params.id} updated successfully!`, userData: updatedUser });
    } else {
      res.status(404).json({ message: 'User not found!' });
    }
  } catch (err) {
    res.status(400).json({ message: 'Error updating user', error: err.message });
  }
});

// DELETE: Delete an existing user
router.delete('/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id); // Delete the user by ID
    if (deletedUser) {
      res.json({ message: 'User deleted successfully!' });
    } else {
      res.status(404).json({ message: 'User not found!' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user', error: err.message });
  }
});

export default router;
