import mongoose from 'mongoose';
import crypto from 'crypto';
import { Review } from './models/review.model';

const reviewTemplates = [
    { userEmail: 'user@example.com', username: 'Example User', reviewTitle: 'Kid loved it!!', rating: 5, reviewText: 'My kid absolutely loves this toy. The quality is great and the shapes are very cute.' },
    { userEmail: 'mark@example.com', username: 'Mark Z.', reviewTitle: 'Fine', rating: 4, reviewText: 'It is a nice toy, but slightly smaller than I expected. Still a good purchase.' },
    { userEmail: 'alice@example.com', username: 'Alice Wonderland', reviewTitle: 'Hours of fun!', rating: 5, reviewText: 'My daughter plays with this for hours. Really happy with this purchase.' },
    { userEmail: 'bob.builder@example.com', username: 'Bob B.', reviewTitle: 'Okay, but fragile', rating: 3, reviewText: 'It is a decent toy for the price, but feels a bit fragile in the hands of a toddler.' },
    { userEmail: 'coolaunt@example.com', username: 'Sarah J.', reviewTitle: 'Perfect birthday gift', rating: 5, reviewText: 'Bought this for my nephew and he absolutely adores it. Highly recommend!' },
    { userEmail: 'angrydad@example.com', username: 'Tom H.', reviewTitle: 'Broke immediately', rating: 1, reviewText: 'Very disappointed. A piece snapped off after just two days of normal play.' },
    { userEmail: 'user99@example.com', username: 'Anonymous', reviewTitle: 'Not bad', rating: 4, reviewText: 'Gets the job done, the kids like the bright colors.' },
    { userEmail: 'karen@example.com', username: 'Karen Smith', reviewTitle: 'Decent toy', rating: 3, reviewText: 'It is alright. Nothing special, but it matched the description.' },
    { userEmail: 'teacher.dan@example.com', username: 'Dan', reviewTitle: 'Very educational', rating: 5, reviewText: 'As a teacher, I love toys that promote cognitive development. This does exactly that.' },
    { userEmail: 'momof3@example.com', username: 'SuperMom', reviewTitle: 'Good value', rating: 4, reviewText: 'Worth the money. Keeps the kids occupied so I can drink my coffee in peace.' },
    { userEmail: 'qualitychecker@example.com', username: 'QC_Expert', reviewTitle: 'Great quality', rating: 4, reviewText: 'The material is durable and looks fantastic. Minus one star for the packaging.' },
    { userEmail: 'snuggle@example.com', username: 'CozyFan', reviewTitle: 'Super cute', rating: 5, reviewText: 'The design is amazing. My son keeps it with him every single night.' }
];

const seedReviews = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/toy-store');
        console.log('Connected to MongoDB for review seeding...');

        await Review.deleteMany({});
        console.log('Cleared old reviews.');

        const allToyIds = Array.from({ length: 61 }, (_, i) => i + 1);

        for (let i = allToyIds.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allToyIds[i], allToyIds[j]] = [allToyIds[j], allToyIds[i]];
        }

        const selectedToyIds = allToyIds.slice(0, 40);
        const generatedReviews = [];

        for (const toyId of selectedToyIds) {
            const numReviews = Math.floor(Math.random() * 10) + 1; // 1, 2, or 3 reviews

            for (let r = 0; r < numReviews; r++) {
                const randomTemplate = reviewTemplates[Math.floor(Math.random() * reviewTemplates.length)];

                const randomDaysAgo = Math.floor(Math.random() * 30);
                const reviewDate = new Date();
                reviewDate.setDate(reviewDate.getDate() - randomDaysAgo);

                generatedReviews.push({
                    reviewId: crypto.randomUUID(),
                    toyId: toyId,
                    userEmail: randomTemplate.userEmail,
                    username: randomTemplate.username,
                    reviewTitle: randomTemplate.reviewTitle,
                    rating: randomTemplate.rating,
                    reviewText: randomTemplate.reviewText,
                    date: reviewDate
                });
            }
        }

        await Review.insertMany(generatedReviews);
        console.log(`Successfully seeded ${generatedReviews.length} reviews across 40 random toys!`);

    } catch (error) {
        console.error('Error seeding reviews:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed.');
    }
};

seedReviews();