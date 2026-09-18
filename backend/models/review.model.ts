import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    reviewId: { type: String, required: true, unique: true },
    toyId: { type: Number, required: true, index: true }, // Indexed for fast lookups
    userEmail: { type: String, required: true },
    username: { type: String, required: true },
    reviewTitle: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    reviewText: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

export const Review = mongoose.model('Review', reviewSchema);