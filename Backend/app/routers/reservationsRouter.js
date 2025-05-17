const express = require('express');
const router = express.Router();
const reservationsController = require('../controllers/reservationsController');

/**
 * @swagger
 * tags:
 *   name: Reservations
 *   description: Reservations management
 */

/**
 * @swagger
 * /api/reservations:
 *   get:
 *     tags: [Reservations]
 *     summary: Get all reservations
 *     responses:
 *       200:
 *         description: A list of reservations
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/reservations/{id}:
 *   get:
 *     tags: [Reservations]
 *     summary: Get reservation by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the reservation
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reservation found
 *       404:
 *         description: Reservation not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/reservations:
 *   post:
 *     tags: [Reservations]
 *     summary: Create a new reservation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *               room_id:
 *                 type: integer
 *               check_in_date:
 *                 type: string
 *                 format: date
 *               check_out_date:
 *                 type: string
 *                 format: date
 *               total_price:
 *                 type: number
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Reservation created successfully
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/reservations/{id}:
 *   put:
 *     tags: [Reservations]
 *     summary: Update reservation by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the reservation
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *               room_id:
 *                 type: integer
 *               check_in_date:
 *                 type: string
 *                 format: date
 *               check_out_date:
 *                 type: string
 *                 format: date
 *               total_price:
 *                 type: number
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reservation updated successfully
 *       404:
 *         description: Reservation not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/reservations/{id}:
 *   delete:
 *     tags: [Reservations]
 *     summary: Delete reservation by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the reservation
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reservation deleted successfully
 *       404:
 *         description: Reservation not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/reservations/search:
 *   get:
 *     tags: [Reservations]
 *     summary: Search reservations
 *     parameters:
 *       - name: query
 *         in: query
 *         required: true
 *         description: The search query
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of reservations matching the search query
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/reservations/user/{userId}:
 *   get:
 *     tags: [Reservations]
 *     summary: Get reservations by user ID
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The ID of the user
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of reservations for the user
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/reservations/{id}/status:
 *   put:
 *     tags: [Reservations]
 *     summary: Update reservation status by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the reservation
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reservation status updated successfully
 *       404:
 *         description: Reservation not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/reservations/stats:
 *   get:
 *     tags: [Reservations]
 *     summary: Get reservation statistics
 *     description: Retrieves statistics such as total reservations, counts by status, and total revenue from confirmed reservations.
 *     security:
 *       - bearerAuth: [] # Add if authentication is required
 *     responses:
 *       200:
 *         description: Reservation statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalReservations:
 *                       type: integer
 *                       description: Total number of reservations.
 *                     statusCounts:
 *                       type: object
 *                       description: Counts of reservations for each status.
 *                       example: { "pending": 10, "confirmed": 25, "cancelled": 5 }
 *                     totalConfirmedRevenue:
 *                       type: number
 *                       format: float
 *                       description: Total revenue generated from confirmed reservations.
 *                 message:
 *                   type: string
 *       500:
 *         description: Server error while retrieving statistics
 */
router.get('/stats', reservationsController.getReservationStats);

/**
 * @swagger
 * /api/reservations/stats/revenue:
 *   get:
 *     tags: [Reservations]
 *     summary: Get reservation revenue statistics by time period
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [month, year]
 *         description: Period for revenue statistics
 *     responses:
 *       200:
 *         description: Revenue statistics retrieved successfully
 */
router.get('/stats/revenue', reservationsController.getReservationRevenueStats);

router.get('/', reservationsController.getAllReservations);
router.get('/search', reservationsController.searchReservations);
router.get('/:id', reservationsController.getReservationById);
router.post('/', reservationsController.createReservation);
router.put('/:id', reservationsController.updateReservation);
router.delete('/:id', reservationsController.deleteReservation);
router.get('/user/:userId', reservationsController.getReservationsByUserId);
router.put('/:id/status', reservationsController.updateReservationStatus);

module.exports = router; 