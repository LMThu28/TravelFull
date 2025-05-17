const express = require('express');
const router = express.Router();
const passengersController = require('../controllers/passengersController');

/**
 * @swagger
 * tags:
 *   name: Passengers
 *   description: Passengers management
 */

/**
 * @swagger
 * /api/passengers:
 *   get:
 *     tags: [Passengers]
 *     summary: Get all passengers
 *     responses:
 *       200:
 *         description: A list of passengers
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/passengers/{id}:
 *   get:
 *     tags: [Passengers]
 *     summary: Get passenger by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the passenger
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Passenger found
 *       404:
 *         description: Passenger not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/passengers:
 *   post:
 *     tags: [Passengers]
 *     summary: Create a new passenger
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone_number:
 *                 type: string
 *               passport_number:
 *                 type: string
 *               nationality:
 *                 type: string
 *               user_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Passenger created successfully
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/passengers/{id}:
 *   put:
 *     tags: [Passengers]
 *     summary: Update passenger by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the passenger
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
 *               email:
 *                 type: string
 *               phone_number:
 *                 type: string
 *               passport_number:
 *                 type: string
 *               nationality:
 *                 type: string
 *     responses:
 *       200:
 *         description: Passenger updated successfully
 *       404:
 *         description: Passenger not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/passengers/{id}:
 *   delete:
 *     tags: [Passengers]
 *     summary: Delete passenger by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the passenger
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Passenger deleted successfully
 *       404:
 *         description: Passenger not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/passengers/search:
 *   get:
 *     tags: [Passengers]
 *     summary: Search passengers
 *     parameters:
 *       - name: query
 *         in: query
 *         required: true
 *         description: The search query
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of passengers matching the search query
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/passengers/user/{user_id}:
 *   get:
 *     tags: [Passengers]
 *     summary: Get passengers by user ID
 *     parameters:
 *       - name: user_id
 *         in: path
 *         required: true
 *         description: The ID of the user
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Passengers found
 *       500:
 *         description: Internal Server Error
 */

router.get('/', passengersController.getAllPassengers);
router.get('/search', passengersController.searchPassengers);
router.get('/:id', passengersController.getPassengerById);
router.post('/', passengersController.createPassenger);
router.put('/:id', passengersController.updatePassenger);
router.delete('/:id', passengersController.deletePassenger);
router.get('/user/:user_id', passengersController.getPassengersByUserId);

module.exports = router; 