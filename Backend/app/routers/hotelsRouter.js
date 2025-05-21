const express = require('express');
const router = express.Router();
const hotelsController = require('../controllers/hotelsController');

/**
 * @swagger
 * tags:
 *   name: Hotels
 *   description: Hotels management
 */

/**
 * @swagger
 * /api/hotels:
 *   get:
 *     tags: [Hotels]
 *     summary: Get all hotels
 *     responses:
 *       200:
 *         description: A list of hotels
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/hotels/{id}:
 *   get:
 *     tags: [Hotels]
 *     summary: Get hotel by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the hotel
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Hotel found
 *       404:
 *         description: Hotel not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/hotels:
 *   post:
 *     tags: [Hotels]
 *     summary: Create a new hotel
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               rating:
 *                 type: number
 *               description:
 *                 type: string
 *               amenities:
 *                 type: string
 *               phone_number:
 *                 type: string
 *               email:
 *                 type: string
 *               website:
 *                 type: string
 *               user_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Hotel created successfully
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/hotels/{id}:
 *   put:
 *     tags: [Hotels]
 *     summary: Update hotel by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the hotel
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               rating:
 *                 type: number
 *               description:
 *                 type: string
 *               amenities:
 *                 type: string
 *               phone_number:
 *                 type: string
 *               email:
 *                 type: string
 *               website:
 *                 type: string
 *     responses:
 *       200:
 *         description: Hotel updated successfully
 *       404:
 *         description: Hotel not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/hotels/{id}:
 *   delete:
 *     tags: [Hotels]
 *     summary: Delete hotel by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the hotel
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Hotel deleted successfully
 *       404:
 *         description: Hotel not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/hotels/search:
 *   get:
 *     tags: [Hotels]
 *     summary: Search hotels
 *     parameters:
 *       - name: query
 *         in: query
 *         required: true
 *         description: The search query
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of hotels matching the search query
 *       500:
 *         description: Internal Server Error
 */

router.get('/', hotelsController.getAllHotels);
router.get('/search', hotelsController.searchHotels);
router.get('/:id', hotelsController.getHotelById);
router.post('/', hotelsController.createHotel);
router.put('/:id', hotelsController.updateHotel);
router.delete('/:id', hotelsController.deleteHotel);

module.exports = router; 