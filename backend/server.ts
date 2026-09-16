import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { Toy } from './models/toy.model';

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

app.listen(3000, () => console.log('Server running on http://localhost:3000'));