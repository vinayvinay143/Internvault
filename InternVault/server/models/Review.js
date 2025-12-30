import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
    company: { type: String, required: true },
    role: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    stipend: String,
    review: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    username: String, // Store username snapshot for easier display
    date: { type: Date, default: Date.now }
});

export const Review = mongoose.model("Review", ReviewSchema);
