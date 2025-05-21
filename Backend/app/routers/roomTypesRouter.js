const express = require('express');
const router = express.Router();
const roomTypesController = require('../controllers/roomTypesController');

/**
 * @swagger
 * tags:
 *   name: RoomTypes
 *   description: Room types management
 */

/**
 * @swagger
 * /api/room-types:
 *   get:
 *     tags: [RoomTypes]
 *     summary: Get all room types
 *     responses:
 *       200:
 *         description: A list of room types
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/room-types/{id}:
 *   get:
 *     tags: [RoomTypes]
 *     summary: Get room type by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the room type
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Room type found
 *       404:
 *         description: Room type not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/room-types:
 *   post:
 *     tags: [RoomTypes]
 *     summary: Create a new room type
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hotel_id:
 *                 type: integer
 *               type_name:
 *                 type: string
 *               description:
 *                 type: string
 *               bed_type:
 *                 type: string
 *               occupancy:
 *                 type: integer
 *               price_per_night:
 *                 type: number
 *               amenities:
 *                 type: string
 *     responses:
 *       201:
 *         description: Room type created successfully
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/room-types/{id}:
 *   put:
 *     tags: [RoomTypes]
 *     summary: Update room type by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the room type
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
 *               type_name:
 *                 type: string
 *               description:
 *                 type: string
 *               bed_type:
 *                 type: string
 *               occupancy:
 *                 type: integer
 *               price_per_night:
 *                 type: number
 *               amenities:
 *                 type: string
 *     responses:
 *       200:
 *         description: Room type updated successfully
 *       404:
 *         description: Room type not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/room-types/{id}:
 *   delete:
 *     tags: [RoomTypes]
 *     summary: Delete room type by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the room type
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Room type deleted successfully
 *       404:
 *         description: Room type not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/room-types/search:
 *   get:
 *     tags: [RoomTypes]
 *     summary: Search room types
 *     parameters:
 *       - name: query
 *         in: query
 *         required: true
 *         description: The search query
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of room types matching the search query
 *       500:
 *         description: Internal Server Error
 */

router.get('/', roomTypesController.getAllRoomTypes);
router.get('/search', roomTypesController.searchRoomTypes);
router.get('/:id', roomTypesController.getRoomTypeById);
router.post('/', roomTypesController.createRoomType);
router.put('/:id', roomTypesController.updateRoomType);
router.delete('/:id', roomTypesController.deleteRoomType);

module.exports = router; 