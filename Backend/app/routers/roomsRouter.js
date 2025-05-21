const express = require('express');
const router = express.Router();
const roomsController = require('../controllers/roomsController');

/**
 * @swagger
 * tags:
 *   name: Rooms
 *   description: Rooms management
 */

/**
 * @swagger
 * /api/rooms:
 *   get:
 *     tags: [Rooms]
 *     summary: Get all rooms
 *     responses:
 *       200:
 *         description: A list of rooms
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/rooms/{id}:
 *   get:
 *     tags: [Rooms]
 *     summary: Get room by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the room
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Room found
 *       404:
 *         description: Room not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/rooms:
 *   post:
 *     tags: [Rooms]
 *     summary: Create a new room
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hotel_id:
 *                 type: integer
 *               room_type_id:
 *                 type: integer
 *               room_number:
 *                 type: string
 *               floor:
 *                 type: integer
 *               is_available:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Room created successfully
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/rooms/{id}:
 *   put:
 *     tags: [Rooms]
 *     summary: Update room by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the room
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hotel_id:
 *                 type: integer
 *               room_type_id:
 *                 type: integer
 *               room_number:
 *                 type: string
 *               floor:
 *                 type: integer
 *               is_available:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Room updated successfully
 *       404:
 *         description: Room not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/rooms/{id}:
 *   delete:
 *     tags: [Rooms]
 *     summary: Delete room by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the room
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Room deleted successfully
 *       404:
 *         description: Room not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/rooms/search:
 *   get:
 *     tags: [Rooms]
 *     summary: Search rooms
 *     parameters:
 *       - name: query
 *         in: query
 *         required: true
 *         description: The search query
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of rooms matching the search query
 *       500:
 *         description: Internal Server Error
 */

router.get('/', roomsController.getAllRooms);
router.get('/search', roomsController.searchRooms);
router.get('/:id', roomsController.getRoomById);
router.post('/', roomsController.createRoom);
router.put('/:id', roomsController.updateRoom);
router.delete('/:id', roomsController.deleteRoom);

module.exports = router; 