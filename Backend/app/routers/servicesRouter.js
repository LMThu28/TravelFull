const express = require('express');
const router = express.Router();
const servicesController = require('../controllers/servicesController');

/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Retrieve a list of services
 *     responses:
 *       200:
 *         description: A list of services
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   categories_id:
 *                     type: integer
 *                   image:
 *                     type: string
 */

/**
 * @swagger
 * /api/services/category/{categoryId}:
 *   get:
 *     summary: Retrieve a list of services by category ID
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         description: The ID of the category to filter services
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of services for the specified category
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   categories_id:
 *                     type: integer
 *                   image:
 *                     type: string
 */

router.get('/search', servicesController.searchServices);
router.get('/', servicesController.getAllServices);
router.get('/:id', servicesController.getServiceById);
router.get('/category/:categoryId', servicesController.getServicesByCategoryId);
router.post('/', servicesController.createService);
router.put('/:id', servicesController.updateService);
router.delete('/:id', servicesController.deleteService);
router.post('/recommend', servicesController.recommendServices);


module.exports = router; 