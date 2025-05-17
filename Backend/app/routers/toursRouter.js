const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tourController');

// --- Tour Schedules Routes ---
// --- Tour Bookings Routes ---

// --- Tour Statistics Route ---
/**
 * @swagger
 * /api/tours/stats:
 *   get:
 *     tags: [Tours]
 *     summary: Get tour and booking statistics
 *     description: Retrieves statistics such as total tours, total confirmed bookings, and total revenue from confirmed bookings.
 *     security:
 *       - bearerAuth: [] # Add if authentication is required
 *     responses:
 *       200:
 *         description: Tour statistics retrieved successfully
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
 *                     totalTours:
 *                       type: integer
 *                       description: Total number of tours available.
 *                     totalConfirmedBookings:
 *                       type: integer
 *                       description: Total number of confirmed tour bookings.
 *                     totalRevenue:
 *                       type: number
 *                       format: float
 *                       description: Total revenue generated from confirmed bookings.
 *                 message:
 *                   type: string
 *       500:
 *         description: Server error while retrieving statistics
 */
router.get('/stats', tourController.getTourStats);

/**
 * @swagger
 * /api/tours/stats/revenue:
 *   get:
 *     tags: [Tours]
 *     summary: Get tour revenue statistics by time period
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
router.get('/stats/revenue', tourController.getTourRevenueStats);

/**
 * @swagger
 * /api/tours/bookings:
 *   get:
 *     tags: [Tours]
 *     summary: Get all tour bookings (Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 */
router.get('/bookings', tourController.getAllTourBookings);

/**
 * @swagger
 * /api/tours/schedules:
 *   get:
 *     tags: [Tour Schedules]
 *     summary: Get all tour schedules
 *     description: Retrieve a list of all tour schedules, optionally filtered by tour_id. Supports pagination.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: tour_id
 *         schema:
 *           type: integer
 *         description: Optional Tour ID to filter schedules
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: A list of tour schedules with pagination info
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
 *                     schedules:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/TourSchedule' # Cần định nghĩa schema này
 *                     pagination:
 *                       $ref: '#/components/schemas/Pagination' # Cần định nghĩa schema này
 *                 message:
 *                   type: string
 *       500:
 *         description: Server error
 */
router.get('/schedules', tourController.getAllTourSchedules);

/**
 * @swagger
 * /api/tours/schedules/{id}:
 *   get:
 *     tags: [Tour Schedules]
 *     summary: Get tour schedule by ID
 *     description: Retrieve details of a specific tour schedule.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the tour schedule to retrieve
 *     responses:
 *       200:
 *         description: Tour schedule details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TourSchedule'
 *       404:
 *         description: Tour schedule not found
 *       500:
 *         description: Server error
 */
router.get('/schedules/:id', tourController.getTourScheduleById);

/**
 * @swagger
 * /api/tours/schedules:
 *   post:
 *     tags: [Tour Schedules]
 *     summary: Create a new tour schedule
 *     description: Add a new schedule for an existing tour.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tour_id
 *               - start_date
 *               - end_date
 *               - max_participants
 *               # - price (Nếu bạn thêm cột này vào bảng schedules)
 *             properties:
 *               tour_id:
 *                 type: integer
 *               start_date:
 *                 type: string
 *                 format: date
 *                 example: "2024-12-25"
 *               end_date:
 *                 type: string
 *                 format: date
 *                 example: "2024-12-30"
 *               max_participants:
 *                 type: integer
 *                 minimum: 1
 *               # price:
 *               #   type: number
 *               #   format: float
 *               #   minimum: 0.01
 *     responses:
 *       201:
 *         description: Tour schedule created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TourSchedule'
 *       400:
 *         description: Invalid input data (e.g., invalid tour, invalid dates, invalid price/participants)
 *       500:
 *         description: Server error
 */
router.post('/schedules', tourController.createTourSchedule);

/**
 * @swagger
 * /api/tours/schedules/{id}:
 *   put:
 *     tags: [Tour Schedules]
 *     summary: Update a tour schedule
 *     description: Modify details of an existing tour schedule.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the tour schedule to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *               max_participants:
 *                 type: integer
 *                 minimum: 1
 *               # price:
 *               #   type: number
 *               #   format: float
 *               #   minimum: 0.01
 *               status:
 *                 type: string
 *                 enum: [available, fully_booked, cancelled]
 *     responses:
 *       200:
 *         description: Tour schedule updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TourSchedule'
 *       400:
 *         description: Invalid input data or constraints violation (e.g., max participants too low)
 *       404:
 *         description: Tour schedule not found
 *       500:
 *         description: Server error
 */
router.put('/schedules/:id', tourController.updateTourSchedule);

/**
 * @swagger
 * /api/tours/schedules/{id}:
 *   delete:
 *     tags: [Tour Schedules]
 *     summary: Delete a tour schedule
 *     description: Remove a tour schedule. Fails if there are associated bookings.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the tour schedule to delete
 *     responses:
 *       200:
 *         description: Tour schedule deleted successfully
 *       400:
 *         description: Cannot delete schedule with associated bookings
 *       404:
 *         description: Tour schedule not found
 *       500:
 *         description: Server error
 */
router.delete('/schedules/:id', tourController.deleteTourSchedule);


// --- Tour Categories Routes ---
/**
 * @swagger
 * /api/tours/categories:
 *   post:
 *     tags: [Tours]
 *     summary: Create a new tour category
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 */
router.post('/categories', tourController.createTourCategory);

/**
 * @swagger
 * /api/tours/categories:
 *   get:
 *     tags: [Tours]
 *     summary: Get all tour categories
 */
router.get('/categories', tourController.getAllTourCategories);

/**
 * @swagger
 * /api/tours/categories/{id}:
 *   get:
 *     tags: [Tours]
 *     summary: Get tour category by ID
 */
router.get('/categories/:id', tourController.getTourCategoryById);

/**
 * @swagger
 * /api/tours/categories/{id}:
 *   put:
 *     tags: [Tours]
 *     summary: Update a tour category
 *     security:
 *       - bearerAuth: []
 */
router.put('/categories/:id', tourController.updateTourCategory);

/**
 * @swagger
 * /api/tours/categories/{id}:
 *   delete:
 *     tags: [Tours]
 *     summary: Delete a tour category
 *     security:
 *       - bearerAuth: []
 */
router.delete('/categories/:id', tourController.deleteTourCategory);

// --- Tours Routes ---
/**
 * @swagger
 * /api/tours:
 *   post:
 *     tags: [Tours]
 *     summary: Create a new tour
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - category_id
 *               - name
 *               - description
 *               - duration
 *               - max_participants
 *             properties:
 *               category_id:
 *                 type: integer
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               duration:
 *                 type: string
 *               max_participants:
 *                 type: integer
 *               start_location:
 *                 type: string
 *               end_location:
 *                 type: string
 *               included_services:
 *                 type: string
 *               excluded_services:
 *                 type: string
 *               notes:
 *                 type: string
 */
router.post('/', tourController.createTour);

/**
 * @swagger
 * /api/tours:
 *   get:
 *     tags: [Tours]
 *     summary: Get all tours
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 */
router.get('/', tourController.getAllTours);

/**
 * @swagger
 * /api/tours/{id}:
 *   get:
 *     tags: [Tours]
 *     summary: Get tour by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
router.get('/:id', tourController.getTourById);

/**
 * @swagger
 * /api/tours/{id}:
 *   put:
 *     tags: [Tours]
 *     summary: Update a tour
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category_id:
 *                 type: integer
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               duration:
 *                 type: string
 *               max_participants:
 *                 type: integer
 *               start_location:
 *                 type: string
 *               end_location:
 *                 type: string
 *               included_services:
 *                 type: string
 *               excluded_services:
 *                 type: string
 *               notes:
 *                 type: string
 */
router.put('/:id', tourController.updateTour);

/**
 * @swagger
 * /api/tours/{id}:
 *   delete:
 *     tags: [Tours]
 *     summary: Delete a tour
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
router.delete('/:id', tourController.deleteTour);




/**
 * @swagger
 * /api/tours/bookings:
 *   post:
 *     tags: [Tours]
 *     summary: Create a new tour booking
 *     security:
 *       - bearerAuth: []
 */
router.post('/bookings', tourController.createTourBooking);

/**
 * @swagger
 * /api/tours/bookings/user/{userId}:
 *   get:
 *     tags: [Tours]
 *     summary: Get user's tour bookings
 *     security:
 *       - bearerAuth: []
 */
router.get('/bookings/user/:userId', tourController.getUserBookings);

/**
 * @swagger
 * /api/tours/bookings/{id}:
 *   patch:
 *     tags: [Tours]
 *     summary: Update booking status
 *     security:
 *       - bearerAuth: []
 */
router.patch('/bookings/:id', tourController.updateBookingStatus);


module.exports = router; 