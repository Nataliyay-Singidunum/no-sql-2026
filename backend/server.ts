import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { Toy } from './models/toy.model';
import { Review } from './models/review';

const app = express();

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/toy-store')
    .then(() => console.log('Connected to MongoDB!'))
    .catch(err => console.error('Connection failed:', err));

// Default
app.get('/', (req, res) => {
    res.send('API is running smoothly!');
});

// All yoys
app.get('/api/toy', async (req, res) => {
    try {
        const toys = await Toy.find();
        res.json(toys);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch toys" });
    }
});

// Details
app.get('/api/toy/permalink/:permalink', async (req, res) => {
    try {
        const targetPermalink = req.params.permalink;

        const toy = await Toy.findOne({ permalink: targetPermalink });

        if (!toy) {
            return res.status(404).json({ message: "Toy not found" });
        }

        res.json(toy);
    } catch (error) {
        console.error("Error fetching single toy:", error);
        res.status(500).json({ message: "Failed to fetch toy details" });
    }
});

// Filter types
app.get('/api/type', async (req, res) => {
    try {
        const types = await Toy.distinct('type');
        res.json(types);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch types" });
    }
});

// Filter age groups
app.get('/api/age-group', async (req, res) => {
    try {
        const ageGroups = await Toy.distinct('ageGroup');
        res.json(ageGroups);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch age groups" });
    }
});

// REVIEWS
app.get('/api/review/:toyId', async (req, res) => {
    try {
        const targetToyId = Number(req.params.toyId);
        const reviews = await Review.find({ toyId: targetToyId }).sort({ date: -1 }); // Newest first
        res.json(reviews);
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ message: "Failed to fetch reviews" });
    }
});

app.post('/api/review', async (req, res) => {
    try {
        const newReview = new Review(req.body);
        const savedReview = await newReview.save();
        res.status(201).json(savedReview);
    } catch (error) {
        console.error("Error saving review:", error);
        res.status(500).json({ message: "Failed to save review" });
    }
});


app.listen(3000, () => console.log('Server running on http://localhost:3000'));