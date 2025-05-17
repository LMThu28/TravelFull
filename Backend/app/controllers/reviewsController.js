const db = require('../config/db');

// Thêm review
const addReview = async (req, res) => {
    const { hotel_id, user_id, content, rating } = req.body;
    try {
        const result = await db('reviews').insert({ hotel_id, user_id, content, rating });
        res.status(201).json({ message: 'Review added successfully', review_id: result[0] });
    } catch (error) {
        res.status(500).json({ message: 'Error adding review', error });
    }
};

// Sửa review
const updateReview = async (req, res) => {
    const { review_id } = req.params;
    const { content, rating } = req.body;
    try {
        await db('reviews').where({ review_id }).update({ content, rating, updated_at: db.fn.now() });
        res.json({ message: 'Review updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating review', error });
    }
};

// Xóa review
const deleteReview = async (req, res) => {
    const { review_id } = req.params;
    try {
        await db('reviews').where({ review_id }).del();
        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting review', error });
    }
};

// Lấy tất cả reviews
const getAllReviews = async (req, res) => {
    try {
        const reviews = await db('reviews').select('*');
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reviews', error });
    }
};

// Lấy review theo ID
const getReviewById = async (req, res) => {
    const { review_id } = req.params;
    try {
        const review = await db('reviews').where({ review_id }).first();
        if (review) {
            res.json(review);
        } else {
            res.status(404).json({ message: 'Review not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching review', error });
    }
};

const getHotelReviewsStats = async (req, res) => {
    const { hotel_id } = req.params;
    try {
        const reviews = await db('reviews').where({ hotel_id });
        const totalReviews = reviews.length;
        const averageRating = totalReviews > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews : 0;

        res.json({ totalReviews, averageRating });
    } catch (error) {
        console.error('Error fetching reviews stats:', error);
        res.status(500).json({ message: 'Error fetching reviews stats' });
    }
};

module.exports = {
    addReview,
    updateReview,
    deleteReview,
    getAllReviews,
    getReviewById,
    getHotelReviewsStats,
}; 