const express = require('express');
const router = express.Router();
const bookingsController = require('../controllers/bookingsController');

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Bookings management
 */

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     tags: [Bookings]
 *     summary: Get all bookings
 *     responses:
 *       200:
 *         description: A list of bookings
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/bookings/{id}:
 *   get:
 *     tags: [Bookings]
 *     summary: Get booking by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the booking
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Booking found
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     tags: [Bookings]
 *     summary: Create a new booking
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               flight_id:
 *                 type: integer
 *               passenger_id:
 *                 type: integer
 *               booking_date:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *               total_price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/bookings/{id}:
 *   put:
 *     tags: [Bookings]
 *     summary: Update booking by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the booking
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               flight_id:
 *                 type: integer
 *               passenger_id:
 *                 type: integer
 *               booking_date:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *               total_price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Booking updated successfully
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/bookings/{id}:
 *   delete:
 *     tags: [Bookings]
 *     summary: Delete booking by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the booking
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Booking deleted successfully
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/bookings/search:
 *   get:
 *     tags: [Bookings]
 *     summary: Search bookings
 *     parameters:
 *       - name: query
 *         in: query
 *         required: true
 *         description: The search query
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of bookings matching the search query
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/bookings/user/{user_id}:
 *   get:
 *     tags: [Bookings]
 *     summary: Get bookings by user ID
 *     parameters:
 *       - name: user_id
 *         in: path
 *         required: true
 *         description: The ID of the user
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Bookings found
 *       404:
 *         description: No passengers found for this user
 *       500:
 *         description: Internal Server Error
 */

router.get('/', bookingsController.getAllBookings);
router.get('/search', bookingsController.searchBookings);
router.get('/:id', bookingsController.getBookingById);
router.post('/', bookingsController.createBooking);
router.put('/:id', bookingsController.updateBooking);
router.delete('/:id', bookingsController.deleteBooking);
router.get('/user/:user_id', bookingsController.getBookingsByUserId);

module.exports = router; 