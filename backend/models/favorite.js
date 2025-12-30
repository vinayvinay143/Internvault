import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  projectId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  domain: String,
  level: String,
  description: String,
  image: String,
  sources: [{
    name: String,
    link: String
  }]
}, {
  timestamps: true
});


favoriteSchema.index({ userId: 1, projectId: 1 }, { unique: true });

export default mongoose.model("Favorite", favoriteSchema);
