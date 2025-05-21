const db = require('../config/db');
const { createResponse } = require('../helpers/utils');

const hotelsController = {
    getAllHotels: async (req, res) => {
        try {
            const hotels = await db('hotels').select('*');
            res.status(200).json(createResponse(true, hotels, 'Hotels retrieved successfully'));
        } catch (err) {
            console.error(err);
            res.status(500).json(createResponse(false, null, 'Error retrieving hotels'));
        }
    },

    getHotelById: async (req, res) => {
        try {
            const hotel = await db('hotels').where('hotel_id', req.params.id).first();
            if (!hotel) {
                return res.status(404).json(createResponse(false, null, 'Hotel not found'));
            }
            res.status(200).json(createResponse(true, hotel, 'Hotel retrieved successfully'));
        } catch (err) {
            console.error(err);
            res.status(500).json(createResponse(false, null, 'Error retrieving hotel'));
        }
    },

    createHotel: async (req, res) => {
        try {
            const [id] = await db('hotels').insert(req.body);
            const newHotel = await db('hotels').where('hotel_id', id).first();
            res.status(201).json(createResponse(true, newHotel, 'Hotel created successfully'));
        } catch (err) {
            console.error(err);
            res.status(500).json(createResponse(false, null, 'Error creating hotel'));
        }
    },

    updateHotel: async (req, res) => {
        try {
            await db('hotels').where('hotel_id', req.params.id).update(req.body);
            const updatedHotel = await db('hotels').where('hotel_id', req.params.id).first();
            res.status(200).json(createResponse(true, updatedHotel, 'Hotel updated successfully'));
        } catch (err) {
            console.error(err);
            res.status(500).json(createResponse(false, null, 'Error updating hotel'));
        }
    },

    deleteHotel: async (req, res) => {
        try {
            await db('hotels').where('hotel_id', req.params.id).del();
            res.status(200).json(createResponse(true, null, 'Hotel deleted successfully'));
        } catch (err) {
            console.error(err);
            res.status(500).json(createResponse(false, null, 'Error deleting hotel'));
        }
    },

    searchHotels: async (req, res) => {
        const { query } = req.query;
        try {
            const hotels = await db('hotels').where('name', 'like', `%${query}%`);
            res.status(200).json(createResponse(true, hotels, 'Hotels searched successfully'));
        } catch (error) {
            console.error('Error searching hotels:', error);
            res.status(500).json(createResponse(false, null, 'Error searching hotels'));
        }
    },
};

module.exports = hotelsController; 