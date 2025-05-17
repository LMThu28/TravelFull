const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _const = require('../config/constant');
const { createResponse } = require('../helpers/utils');

const userController = {
    getAllUsers: async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10000;
        const offset = (page - 1) * limit;

        try {
            const users = await db('users')
                .select('*')
                .limit(limit)
                .offset(offset);
            res.status(200).json(createResponse(true, users, 'Users retrieved successfully'));
        } catch (err) {
            res.status(500).json(createResponse(false, null, 'Error retrieving users'));
        }
    },

    createUser: async (req, res) => {
        try {
            const { email, phone, username, password, role, status } = req.body;

            const existingEmail = await db('users').where('email', email).first();
            if (existingEmail) {
                return res.status(200).json(createResponse(false, null, "User with this email already exists"));
            }

            const existingPhone = await db('users').where('phone', phone).first();
            if (existingPhone) {
                return res.status(200).json(createResponse(false, null, "User with this phone number already exists"));
            }

            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(password, salt);

            const [userId] = await db('users').insert({
                email,
                phone,
                username,
                password: hashed,
                role,
                status
            });

            res.status(200).json(createResponse(true, { id: userId, email, phone, username, role, status }, 'User created successfully'));
        } catch (err) {
            res.status(500).json(createResponse(false, null, 'Error creating user'));
        }
    },

    deleteUser: async (req, res) => {
        try {
            const userId = req.params.id;

            const user = await db('users').where('id', userId).first();

            if (!user) {
                return res.status(404).json(createResponse(false, null, "User not found"));
            }

            await db('users').where('id', userId).del();

            res.status(200).json(createResponse(true, null, "User deleted successfully"));
        } catch (err) {
            res.status(500).json(createResponse(false, null, 'Error deleting user'));
        }
    },

    updateUser: async (req, res) => {
        try {
            const userId = req.params.id;
            const { username, email, password, role, phone, status } = req.body;

            const existingEmail = await db('users').where('email', email).whereNot('id', userId).first();

            if (existingEmail) {
                return res.status(400).json(createResponse(false, null, 'Email already exists'));
            }

            const updateData = {
                username,
                email,
                role,
                phone,
                status
            };

            if (password) {
                const salt = await bcrypt.genSalt(10);
                updateData.password = await bcrypt.hash(password, salt);
            }

            const result = await db('users').where('id', userId).update(updateData);

            if (result === 0) {
                return res.status(404).json(createResponse(false, null, 'User not found'));
            }

            res.status(200).json(createResponse(true, null, "User updated successfully"));
        } catch (err) {
            console.log(err);
            res.status(500).json(createResponse(false, null, 'Error updating user'));
        }
    },

    logout: async (req, res) => {
        // Implement logout logic if needed
    },

    searchUserByEmail: async (req, res) => {
        const email = req.query.email;
    
        try {
            const userList = await db('users')
                .where('email', 'like', `%${email}%`)
                .select('*');
            res.status(200).json(createResponse(true, userList, 'Users searched successfully'));
        } catch (err) {
            res.status(500).json(createResponse(false, null, 'Error searching users'));
        }
    },

    getProfile: async (req, res) => {
        jwt.verify(req.headers.authorization, _const.JWT_ACCESS_KEY, async (err, decodedToken) => {
            if (err) {
                res.status(401).json(createResponse(false, null, 'Unauthorized'));
            } else {
                try {
                    const userId = decodedToken.user.id;

                    const user = await db('users').where('id', userId).first();
    
                    if (!user) {
                        return res.status(404).json(createResponse(false, null, 'User not found'));
                    }
    
                    const formattedUser = {
                        user: {
                            id: user.id,
                            email: user.email,
                            phone: user.phone,
                            username: user.username,
                            password: user.password,
                            role: user.role,
                            status: user.status,
                            image: user.image,
                            created_at: user.created_at,
                            updated_at: user.updated_at
                        },
                        iat: decodedToken.iat,
                        exp: decodedToken.exp
                    };
    
                    res.status(200).json(createResponse(true, formattedUser, 'Profile retrieved successfully'));
                } catch (err) {
                    console.log(err);
                    res.status(500).json(createResponse(false, null, 'Error retrieving profile'));
                }
            }
        });
    },

    getProfileById: async (req, res) => {
        const userId = req.params.id;

        try {
            const user = await db('users').where('id', userId).first();

            if (!user) {
                return res.status(404).json(createResponse(false, null, 'User not found'));
            }

            const formattedUser = {
                id: user.id,
                email: user.email,
                phone: user.phone,
                username: user.username,
                role: user.role,
                status: user.status,
                image: user.image,
                created_at: user.created_at,
                updated_at: user.updated_at
            };

            res.status(200).json(createResponse(true, formattedUser, 'Profile retrieved successfully'));
        } catch (err) {
            console.log(err);
            res.status(500).json(createResponse(false, null, 'Error retrieving profile'));
        }
    },

    updateProfile: async (req, res) => {
        try {
            const userId = req.params.id;
            const { username, email, phone, status, image } = req.body;

            const result = await db('users')
                .where('id', userId)
                .update({
                    username,
                    email,
                    image,
                    phone,
                    status
                });

            if (result === 0) {
                return res.status(404).json(createResponse(false, null, 'User not found'));
            }

            res.status(200).json(createResponse(true, null, "Profile updated successfully"));
        } catch (err) {
            console.log(err);
            res.status(500).json(createResponse(false, null, 'Error updating profile'));
        }
    },

    changePassword: async (req, res) => {
        try {
            const userId = req.params.id;
            const { currentPassword, newPassword } = req.body;

            const user = await db('users').where('id', userId).first();

            if (!user) {
                return res.status(200).json(createResponse(false, null, 'User not found'));
            }

            const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

            if (!isPasswordValid) {
                return res.status(200).json(createResponse(false, null, 'Current password is incorrect'));
            }

            const salt = await bcrypt.genSalt(10);
            const hashedNewPassword = await bcrypt.hash(newPassword, salt);

            await db('users')
                .where('id', userId)
                .update({ password: hashedNewPassword });

            res.status(200).json(createResponse(true, null, "Password changed successfully"));
        } catch (err) {
            console.log(err);
            res.status(500).json(createResponse(false, null, 'Error changing password'));
        }
    },
};

module.exports = userController;
