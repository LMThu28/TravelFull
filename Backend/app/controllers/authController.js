const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _const = require('../config/constant');
const { createResponse } = require('../helpers/utils');
const nodemailer = require('nodemailer');

const authController = {
    registerUser: async (req, res) => {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);

            // Kiểm tra xem email và số điện thoại đã tồn tại trong cơ sở dữ liệu chưa
            const existingUser = await db('users').where('email', req.body.email).first();
            const existingPhone = await db('users').where('phone', req.body.phone).first();

            if (existingUser) {
                return res.status(200).json('Email is exist');
            }

            if (existingPhone) {
                return res.status(200).json('Phone number is exist');
            }

            // Thêm người dùng mới vào cơ sở dữ liệu
            const [userId] = await db('users').insert({
                username: req.body.username,
                email: req.body.email,
                password: hashed,
                phone: req.body.phone,
                role: req.body.role,
                status: req.body.status
            });

            const user = {
                id: userId,
                username: req.body.username,
                email: req.body.email,
                phone: req.body.phone,
                role: req.body.role,
                status: req.body.status
            };

            res.status(200).json(user);
        } catch (err) {
            console.error(err);
            res.status(500).json('Register fails');
        }
    },

    login: async (req, res) => {
        try {
            // Kiểm tra xem email có tồn tại trong cơ sở dữ liệu không
            const user = await db('users').where('email', req.body.email).first();

            if (!user) {
                return res.status(200).json({ message: 'Unregistered account!', status: false });
            }

            // So sánh mật khẩu
            const validatePassword = await bcrypt.compare(req.body.password, user.password);

            if (!validatePassword) {
                return res.status(200).json({ message: 'Wrong password!', status: false });
            }

            // Tạo mã thông báo JWT
            const token = jwt.sign({ user: user }, _const.JWT_ACCESS_KEY, { expiresIn: '30d' });

            res.header('Authorization', token);
            res.status(200).json(createResponse(true, { token, user }, 'Login successful'));
        } catch (error) {
            console.error(error);
            res.status(500).json(createResponse(false, null, 'Error during login'));
        }
    },

    resetPassword: async (req, res) => {
        try {
            const { email } = req.body;

            // Check if the email exists in the database
            const user = await db('users').where('email', email).first();

            if (!user) {
                return res.status(400).json({ message: 'Unregistered account', status: false });
            }

            // Generate a new password
            const newPassword = Math.random().toString(36).slice(-8);
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            // Update the user's password in the database
            await db('users').where('email', email).update({ password: hashedPassword });

            // Set up the email transporter
            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: '587',
                auth: {
                    user: 'h5studiogl@gmail.com',
                    pass: 'ubqq hfra cduj tlnq',
                },
            });

            // Define the email options
            const mailOptions = {
                from: 'coms@gmail.com',
                to: user.email,
                subject: 'Reset Password',
                text: `Your new password is: ${newPassword}`,
            };

            // Send the email
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ message: 'Failed to send reset email', status: false });
                }
                res.status(200).json({ message: 'Reset email sent successfully', status: true });
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error during password reset', status: false });
        }
    },

    sendMessageToAdmin: async (req, res) => {
        try {
            const { username, message, email } = req.body;

            // Thiết lập email transporter
            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: '587',
                auth: {
                    user: 'h5studiogl@gmail.com',
                    pass: 'ubqq hfra cduj tlnq',
                },
            });

            // Định nghĩa các tùy chọn email
            const mailOptions = {
                from: email,
                to: 'chauquang132003@gmail.com',
                subject: `Message from ${username}`,
                text: message,
            };

            // Gửi email
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ message: 'Failed to send message', status: false });
                }
                res.status(200).json({ message: 'Message sent successfully', status: true });
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error sending message', status: false });
        }
    },
};

module.exports = authController;
