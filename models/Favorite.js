// models/Favorite.js
import mongoose from "mongoose";

const FavoriteSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  itemId: { type: String, required: true },
}, { timestamps: true });

const Favorite = mongoose.model("Favorite", FavoriteSchema);

export default Favorite;
