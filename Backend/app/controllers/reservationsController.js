const db = require('../config/db');
const { createResponse } = require('../helpers/utils');
const nodemailer = require('nodemailer');

const reservationsController = {
    getAllReservations: async (req, res) => {
        try {
            const reservations = await db('reservations').select('*');
            res.status(200).json(createResponse(true, reservations, 'Reservations retrieved successfully'));
        } catch (err) {
            console.error(err);
            res.status(500).json(createResponse(false, null, 'Error retrieving reservations'));
        }
    },

    getReservationById: async (req, res) => {
        try {
            const reservation = await db('reservations').where('reservation_id', req.params.id).first();
            if (!reservation) {
                return res.status(404).json(createResponse(false, null, 'Reservation not found'));
            }
            res.status(200).json(createResponse(true, reservation, 'Reservation retrieved successfully'));
        } catch (err) {
            console.error(err);
            res.status(500).json(createResponse(false, null, 'Error retrieving reservation'));
        }
    },

    createReservation: async (req, res) => {
        try {
            const { room_id, check_in_date, check_out_date } = req.body;

            // Check for overlapping reservations
            const overlappingReservations = await db('reservations')
                .where('room_id', room_id)
                .andWhere((builder) => {
                    builder.whereBetween('check_in_date', [check_in_date, check_out_date])
                           .orWhereBetween('check_out_date', [check_in_date, check_out_date])
                           .orWhere(function() {
                               this.where('check_in_date', '<=', check_in_date)
                                   .where('check_out_date', '>=', check_out_date);
                           });
                });

            if (overlappingReservations.length > 0) {
                return res.status(400).json(createResponse(false, null, 'Room is already booked for the selected dates'));
            }

            const [id] = await db('reservations').insert(req.body);
            const newReservation = await db('reservations').where('reservation_id', id).first();

            const user = await db('users').where('id', req.body.user_id).first();
            if (!user) {
                return res.status(404).json(createResponse(false, null, 'User not found'));
            }

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
                to: user.email,
                subject: 'Xác Nhận Đặt Phòng',
                html: `
                    <h1>Chào bạn!</h1>
                    <p>Chúng tôi xin thông báo rằng đặt phòng của bạn đã được tạo thành công.</p>
                    <p><strong>Mã đặt phòng:</strong> ${id}</p>
                    <p>Cảm ơn bạn đã chọn dịch vụ của chúng tôi!</p>
                    <p>Trân trọng,</p>
                    <p>Đội ngũ hỗ trợ khách hàng</p>
                `,
            });

            res.status(201).json(createResponse(true, newReservation, 'Reservation created successfully'));
        } catch (err) {
            console.error(err);
            res.status(500).json(createResponse(false, null, 'Error creating reservation'));
        }
    },

    updateReservation: async (req, res) => {
        try {
            const { status } = req.body; // Get the new status from the request body
            await db('reservations').where('reservation_id', req.params.id).update(req.body);
            const updatedReservation = await db('reservations').where('reservation_id', req.params.id).first();

            console.log(status)

            // If the status is canceled, send an email to the user
            if (status === 'cancelled') {
                const user = await db('users').where('id', updatedReservation.user_id).first();
                console.log(user)
                if (user) {
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
                        to: user.email,
                        subject: 'Thông Báo Hủy Đặt Phòng',
                        html: `
                            <h1>Chào bạn!</h1>
                            <p>Chúng tôi xin thông báo rằng đặt phòng của bạn đã bị hủy.</p>
                            <p><strong>Mã đặt phòng:</strong> ${updatedReservation.reservation_id}</p>
                            <p>Cảm ơn bạn đã chọn dịch vụ của chúng tôi!</p>
                            <p>Trân trọng,</p>
                            <p>Đội ngũ hỗ trợ khách hàng</p>
                        `,
                    });
                }
            }

            res.status(200).json(createResponse(true, updatedReservation, 'Reservation updated successfully'));
        } catch (err) {
            console.error(err);
            res.status(500).json(createResponse(false, null, 'Error updating reservation'));
        }
    },

    deleteReservation: async (req, res) => {
        try {
            await db('reservations').where('reservation_id', req.params.id).del();
            res.status(200).json(createResponse(true, null, 'Reservation deleted successfully'));
        } catch (err) {
            console.error(err);
            res.status(500).json(createResponse(false, null, 'Error deleting reservation'));
        }
    },

    searchReservations: async (req, res) => {
        const { query } = req.query;
        try {
            const reservations = await db('reservations').where('status', 'like', `%${query}%`);
            res.status(200).json(createResponse(true, reservations, 'Reservations searched successfully'));
        } catch (error) {
            console.error('Error searching reservations:', error);
            res.status(500).json(createResponse(false, null, 'Error searching reservations'));
        }
    },

    getReservationsByUserId: async (req, res) => {
        try {
            // Get the user_id from the request parameters
            const userId = req.params.userId;

            // Find the passengers associated with the user_id
            const passengers = await db('passengers').where('user_id', userId);
            if (passengers.length === 0) {
                return res.status(404).json(createResponse(false, null, 'No passengers found for this user'));
            }

            // Use the user_id to get reservations
            const reservations = await db('reservations').where('user_id', userId);
            res.status(200).json(createResponse(true, reservations, 'Reservations retrieved successfully for user'));
        } catch (err) {
            console.error(err);
            res.status(500).json(createResponse(false, null, 'Error retrieving reservations for user'));
        }
    },

    updateReservationStatus: async (req, res) => {
        try {
            const { status } = req.body; // Get the new status from the request body
            const reservationId = req.params.id; // Get the reservation ID from the request parameters

            // Update the reservation status
            const updatedRows = await db('reservations')
                .where('reservation_id', reservationId)
                .update({ status });

            if (updatedRows === 0) {
                return res.status(404).json(createResponse(false, null, 'Reservation not found'));
            }

            const updatedReservation = await db('reservations').where('reservation_id', reservationId).first();

            // Send email notification about the status update
            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: '587',
                auth: {
                    user: 'h5studiogl@gmail.com',
                    pass: 'ubqq hfra cduj tlnq',
                },
            });

            console.log(updatedReservation)


            if (passenger) {
                await transporter.sendMail({
                    from: 'h5studiogl@gmail.com',
                    to: updatedReservation.email,
                    subject: 'Cập nhật trạng thái đặt phòng',
                    text: `Kính gửi ${passenger.name},\n\nTrạng thái đặt phòng của bạn đã được cập nhật thành: ${status}.\n\nCảm ơn bạn đã chọn chúng tôi!`,
                });
            }

            res.status(200).json(createResponse(true, updatedReservation, 'Reservation status updated successfully'));
        } catch (err) {
            console.error(err);
            res.status(500).json(createResponse(false, null, 'Error updating reservation status'));
        }
    },

    // Reservation Statistics
    getReservationStats: async (req, res) => {
        try {
            // Get total number of reservations
            const [totalReservationsResult] = await db('reservations').count('* as count');
            const totalReservations = totalReservationsResult.count;

            // Get counts by status
            const statusCounts = await db('reservations')
                .select('status')
                .count('* as count')
                .groupBy('status');
            
            // Format status counts into an object { status: count }
            const formattedStatusCounts = statusCounts.reduce((acc, row) => {
                acc[row.status] = row.count;
                return acc;
            }, {});

            // Get total revenue from confirmed reservations
            const [totalRevenueResult] = await db('reservations')
                .where('status', 'confirmed') // Assuming 'confirmed' is the status for revenue calculation
                .sum('total_price as totalRevenue');
            const totalRevenue = totalRevenueResult.totalRevenue || 0; // Default to 0 if null

            const stats = {
                totalReservations,
                statusCounts: formattedStatusCounts,
                totalConfirmedRevenue: totalRevenue
            };

            res.json(createResponse(true, stats, 'Reservation statistics retrieved successfully'));
        } catch (error) {
            console.error("Error retrieving reservation statistics:", error);
            res.status(500).json(createResponse(false, null, 'Error retrieving reservation statistics'));
        }
    },

    getReservationRevenueStats: async (req, res) => {
        try {
            const { period = 'month' } = req.query;
            let query;

            if (period === 'month') {
                // Get revenue for last 3 months
                query = db('reservations as r')
                    .select(
                        db.raw('DATE_FORMAT(r.created_at, "%Y-%m") as period'),
                        db.raw('SUM(CASE WHEN r.status = "confirmed" THEN r.total_price ELSE 0 END) as revenue'),
                        db.raw('COUNT(CASE WHEN r.status = "confirmed" THEN 1 END) as confirmed_reservations')
                    )
                    .where('r.created_at', '>=', db.raw('DATE_SUB(CURDATE(), INTERVAL 3 MONTH)'))
                    .groupBy(db.raw('DATE_FORMAT(r.created_at, "%Y-%m")'))
                    .orderBy('period', 'asc');
            } else {
                // Get revenue by year
                query = db('reservations as r')
                    .select(
                        db.raw('YEAR(r.created_at) as period'),
                        db.raw('SUM(CASE WHEN r.status = "confirmed" THEN r.total_price ELSE 0 END) as revenue'),
                        db.raw('COUNT(CASE WHEN r.status = "confirmed" THEN 1 END) as confirmed_reservations')
                    )
                    .where('r.created_at', '>=', db.raw('DATE_SUB(CURDATE(), INTERVAL 2 YEAR)'))
                    .groupBy(db.raw('YEAR(r.created_at)'))
                    .orderBy('period', 'asc');
            }

            const stats = await query;

            res.json(createResponse(true, {
                period,
                stats
            }, 'Reservation revenue statistics retrieved successfully'));
        } catch (error) {
            console.error("Error retrieving reservation revenue statistics:", error);
            res.status(500).json(createResponse(false, null, 'Error retrieving reservation revenue statistics'));
        }
    }
};

module.exports = reservationsController; 