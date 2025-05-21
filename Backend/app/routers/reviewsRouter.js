const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviewsController');

router.post('/', reviewsController.addReview);
router.put('/:review_id', reviewsController.updateReview);
router.delete('/:review_id', reviewsController.deleteReview);
router.get('/', reviewsController.getAllReviews);
router.get('/:review_id', reviewsController.getReviewById);
router.get('/stats/:hotel_id', reviewsController.getHotelReviewsStats);

module.exports = router; 