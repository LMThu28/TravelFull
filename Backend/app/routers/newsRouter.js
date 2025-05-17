const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');

/**
 * @swagger
 * tags:
 *   name: News
 *   description: News management
 */

/**
 * @swagger
 * /api/news:
 *   get:
 *     tags: [News]
 *     summary: Get all news
 *     responses:
 *       200:
 *         description: A list of news
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/news/{id}:
 *   get:
 *     tags: [News]
 *     summary: Get news by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the news
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: News found
 *       404:
 *         description: News not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/news:
 *   post:
 *     tags: [News]
 *     summary: Create a new news
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: News created successfully
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/news/{id}:
 *   put:
 *     tags: [News]
 *     summary: Update news by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the news
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
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: News updated successfully
 *       404:
 *         description: News not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/news/{id}:
 *   delete:
 *     tags: [News]
 *     summary: Delete news by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the news
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: News deleted successfully
 *       404:
 *         description: News not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/news/search:
 *   get:
 *     tags: [News]
 *     summary: Search news
 *     parameters:
 *       - name: query
 *         in: query
 *         required: true
 *         description: The search query
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of news matching the search query
 *       500:
 *         description: Internal Server Error
 */

router.get('/search', newsController.searchNews);
router.put('/:id', newsController.updateNewsById);
router.get('/', newsController.getAllNews);
router.get('/:id', newsController.getNewsById);
router.post('/', newsController.createNews);
router.delete('/:id', newsController.deleteNewsById);
router.get('/category/:category_id', newsController.getNewsByCategory); 

module.exports = router;
