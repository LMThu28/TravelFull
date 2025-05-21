const db = require('../config/db');
const { createResponse } = require('../helpers/utils');
const nodemailer = require('nodemailer');

const bookingsController = {
    getAllBookings: async (req, res) => {
        try {
            const bookings = await db('bookings').select('*');
            res.status(200).json(createResponse(true, bookings, 'Bookings retrieved successfully'));
        } catch (err) {
            console.error(err);
            res.status(500).json(createResponse(false, null, 'Error retrieving bookings'));
        }
    },

    getBookingById: async (req, res) => {
        try {
            const booking = await db('bookings').where('booking_id', req.params.id).first();
            if (!booking) {
                return res.status(404).json(createResponse(false, null, 'Booking not found'));
            }
            res.status(200).json(createResponse(true, booking, 'Booking retrieved successfully'));
        } catch (err) {
            console.error(err);
            res.status(500).json(createResponse(false, null, 'Error retrieving booking'));
        }
    },

    createBooking: async (req, res) => {
        try {
            const [id] = await db('bookings').insert(req.body);
            const newBooking = await db('bookings').where('booking_id', id).first();

            const passenger = await db('passengers').where('passenger_id', req.body.passenger_id).first();
            if (passenger) {
                const transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: '587',
                    auth: {
                        user: 'h5studiogl@gmail.com',
                        pass: 'ubqq hfra cduj tlnq',
                    },
                });

                await transporter.sendMail({
                    from: 'h5studiogl@gmail.com',
                    to: passenger.email,
                    subject: 'Xác nhận đặt vé',
                    text: `Kính gửi ${passenger.name},\n\nĐặt vé của bạn đã được xác nhận!\nMã đặt vé: ${newBooking.booking_id}\n\nCảm ơn bạn đã chọn chúng tôi!`,
                });
            }

            res.status(201).json(createResponse(true, newBooking, 'Booking created successfully'));
        } catch (err) {
            console.error(err);
            res.status(500).json(createResponse(false, null, 'Error creating booking'));
        }
    },

    updateBooking: async (req, res) => {
        try {
            await db('bookings').where('booking_id', req.params.id).update(req.body);
            const updatedBooking = await db('bookings').where('booking_id', req.params.id).first();
            res.status(200).json(createResponse(true, updatedBooking, 'Booking updated successfully'));
        } catch (err) {
            console.error(err);
            res.status(500).json(createResponse(false, null, 'Error updating booking'));
        }
    },

    deleteBooking: async (req, res) => {
        try {
            await db('bookings').where('booking_id', req.params.id).del();
            res.status(200).json(createResponse(true, null, 'Booking deleted successfully'));
        } catch (err) {
            console.error(err);
            res.status(500).json(createResponse(false, null, 'Error deleting booking'));
        }
    },

    searchBookings: async (req, res) => {
        const { query } = req.query;
        try {
            const bookings = await db('bookings').where('status', 'like', `%${query}%`);
            res.status(200).json(createResponse(true, bookings, 'Bookings searched successfully'));
        } catch (error) {
            console.error('Error searching bookings:', error);
            res.status(500).json(createResponse(false, null, 'Error searching bookings'));
        }
    },

    getBookingsByUserId: async (req, res) => {
        const { user_id } = req.params;
        try {
            const passengers = await db('passengers').where('user_id', user_id);
            if (passengers.length === 0) {
                return res.status(404).json(createResponse(false, null, 'No passengers found for this user'));
            }

            const passengerIds = passengers.map(passenger => passenger.passenger_id);

            const bookings = await db('bookings').whereIn('passenger_id', passengerIds);
            res.status(200).json(createResponse(true, bookings, 'Bookings retrieved successfully'));
        } catch (err) {
            console.error(err);
            res.status(500).json(createResponse(false, null, 'Error retrieving bookings'));
        }
    },
};

module.exports = bookingsController; 