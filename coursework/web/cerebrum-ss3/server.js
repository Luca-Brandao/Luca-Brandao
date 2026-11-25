const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const port = Number(process.env.TESTIMONIALS_PORT || 3000);

// Handle JSON requests and enable CORS
app.use(express.json());
app.use(cors());

// Initialize testimonials.json if it doesn't exist
const TESTIMONIALS_FILE = path.join(__dirname, 'testimonials.json');
async function initializeTestimonialsFile() {
    try {
        await fs.access(TESTIMONIALS_FILE);
    } catch (err) {
        await fs.writeFile(TESTIMONIALS_FILE, JSON.stringify([], null, 2));
    }
}


// API route to get testimonials
app.get('/api/testimonials', async (req, res) => {
    try {
        const data = await fs.readFile(TESTIMONIALS_FILE, 'utf8');
        const testimonials = JSON.parse(data);
        res.json(testimonials);
    } catch (err) {
        console.error('Error reading testimonials:', err);
        res.status(500).json({ error: 'Failed to load testimonials' });
    }
});

// API route to add a new testimonial
app.post('/api/testimonials', async (req, res) => {
    try {
        const { name, text, rating } = req.body;
        // Input validation
        if (!name || !text || !rating) {
            return res.status(400).json({ error: 'Name, text, and rating are required' });
        }
        if (typeof rating !== 'number' || rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be a number between 1 and 5' });
        }
        const newTestimonial = { name, text, rating };
        const data = await fs.readFile(TESTIMONIALS_FILE, 'utf8');
        const testimonials = JSON.parse(data);
        testimonials.push(newTestimonial);
        await fs.writeFile(TESTIMONIALS_FILE, JSON.stringify(testimonials, null, 2));
        res.status(201).json({ message: 'Testimonial added successfully' });
    } catch (err) {
        console.error('Error adding testimonial:', err);
        res.status(500).json({ error: 'Failed to add testimonial' });
    }
});

const ready = initializeTestimonialsFile();
async function start() {
    await ready;
    return app.listen(port, () => console.log(`Node.js server running at http://localhost:${port}`));
}
if (require.main === module) {
    start().catch(error => { console.error(error); process.exitCode = 1; });
}
module.exports = { app, ready, start };
