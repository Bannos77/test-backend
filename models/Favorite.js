import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema({
  userId: {
    type: String, // or mongoose.Schema.Types.ObjectId if linked to User collection
    required: true,
  },
  itemId: {
    type: String, // or mongoose.Schema.Types.ObjectId if linked to Item collection
    required: true,
  },
}, { timestamps: true });

export default mongoose.model("Favorite", favoriteSchema);
