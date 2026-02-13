import express from 'express';
import Review from '../models/Review.js';

const router = express.Router();

// Get all reviews
router.get('/', async (req, res) => {
    try {
        const reviews = await Review.find().sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Post a review
router.post('/', async (req, res) => {
    const { name, text, rating } = req.body;
    try {
        const newReview = new Review({ name, text, rating });
        await newReview.save();
        res.json(newReview);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Count reviews to check if they are the first customers
router.get('/count', async (req, res) => {
    try {
        const count = await Review.countDocuments();
        res.json({ count });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

export default router;
