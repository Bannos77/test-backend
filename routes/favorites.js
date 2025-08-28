// routes/favorite.js
import express from "express";
import Favorite from "../models/Favorite.js"; 

const router = express.Router();

// GET all favorites
router.get("/", async (req, res) => {
  try {
    const favorites = await Favorite.find();
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ message: "Error fetching favorites", error: err.message });
  }
});

// GET favorites by userId
router.get("/user/:userId", async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.params.userId });
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ message: "Error fetching favorites for user", error: err.message });
  }
});

// POST: add a new favorite
router.post("/", async (req, res) => {
  const { userId, itemId } = req.body;
  if (!userId || !itemId) {
    return res.status(400).json({ message: "userId and itemId are required" });
  }

  try {
    // Prevent duplicates
    const existing = await Favorite.findOne({ userId, itemId });
    if (existing) {
      return res.status(400).json({ message: "Already favorited" });
    }

    const newFavorite = new Favorite({ userId, itemId });
    const savedFavorite = await newFavorite.save();

    res.status(201).json({ 
      message: "Favorite added successfully!", 
      favorite: savedFavorite 
    });
  } catch (err) {
    res.status(400).json({ message: "Error saving favorite", error: err.message });
  }
});

// PUT: update an existing favorite (e.g., change itemId)
router.put("/:id", async (req, res) => {
  try {
    const updatedFavorite = await Favorite.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (updatedFavorite) {
      res.json({ 
        message: `Favorite with id ${req.params.id} updated successfully!`, 
        favorite: updatedFavorite 
      });
    } else {
      res.status(404).json({ message: "Favorite not found!" });
    }
  } catch (err) {
    res.status(400).json({ message: "Error updating favorite", error: err.message });
  }
});

// DELETE: remove a favorite
router.delete("/:id", async (req, res) => {
  try {
    const deletedFavorite = await Favorite.findByIdAndDelete(req.params.id);

    if (deletedFavorite) {
      res.json({ message: "Favorite deleted successfully!" });
    } else {
      res.status(404).json({ message: "Favorite not found!" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error deleting favorite", error: err.message });
  }
});

export default router;
