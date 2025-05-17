const userController = require("../controllers/userController");
const router = require("express").Router();
const verifyToken = require('../utils/middleware');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /api/user/searchByEmail:
 *   get:
 *     tags: [Users]
 *     summary: Search user by email
 *     parameters:
 *       - name: email
 *         in: query
 *         required: true
 *         description: The email to search for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of users matching the email
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/user:
 *   post:
 *     tags: [Users]
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: User created successfully
 *       400:
 *         description: User with this email or phone already exists
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/user:
 *   get:
 *     tags: [Users]
 *     summary: Get all users
 *     parameters:
 *       - name: page
 *         in: query
 *         required: false
 *         description: The page number for pagination
 *         schema:
 *           type: integer
 *       - name: limit
 *         in: query
 *         required: false
 *         description: The number of users per page
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of users
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     tags: [Users]
 *     summary: Get user profile
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/user/profile/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get user profile by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the user
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/user/updateProfile/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Update user profile
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the user
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               status:
 *                 type: string
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/user/changePassword/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Change user password
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the user
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Current password is incorrect
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/user/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Update user by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the user
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               role:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/user/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Delete user by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the user
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */

router.get("/searchByEmail", userController.searchUserByEmail);
router.get('/profile', userController.getProfile);
router.get('/profile/:id', userController.getProfileById); // New endpoint for getting user profile by ID
router.put('/updateProfile/:id', userController.updateProfile);
router.put('/changePassword/:id', userController.changePassword);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.get('/', userController.getAllUsers); // Đảm bảo endpoint này được định nghĩa ở đây

module.exports = router;
