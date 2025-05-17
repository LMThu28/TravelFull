const db = require('../config/db');
const { createResponse } = require('../helpers/utils');

const roomTypesController = {
    getAllRoomTypes: async (req, res) => {
        try {
            const roomTypes = await db('room_types').select('*');
            res.status(200).json(createResponse(true, roomTypes, 'Room types retrieved successfully'));
        } catch (err) {
            console.error(err);
            res.status(500).json(createResponse(false, null, 'Error retrieving room types'));
        }
    },

    getRoomTypeById: async (req, res) => {
        try {
            const roomType = await db('room_types').where('room_type_id', req.params.id).first();
            if (!roomType) {
                return res.status(404).json(createResponse(false, null, 'Room type not found'));
            }
            res.status(200).json(createResponse(true, roomType, 'Room type retrieved successfully'));
        } catch (err) {
            console.error(err);
            res.status(500).json(createResponse(false, null, 'Error retrieving room type'));
        }
    },

    createRoomType: async (req, res) => {
        try {
            const [id] = await db('room_types').insert(req.body);
            const newRoomType = await db('room_types').where('room_type_id', id).first();
            res.status(201).json(createResponse(true, newRoomType, 'Room type created successfully'));
        } catch (err) {
            console.error(err);
            res.status(500).json(createResponse(false, null, 'Error creating room type'));
        }
    },

    updateRoomType: async (req, res) => {
        try {
            await db('room_types').where('room_type_id', req.params.id).update(req.body);
            const updatedRoomType = await db('room_types').where('room_type_id', req.params.id).first();
            res.status(200).json(createResponse(true, updatedRoomType, 'Room type updated successfully'));
        } catch (err) {
            console.error(err);
            res.status(500).json(createResponse(false, null, 'Error updating room type'));
        }
    },

    deleteRoomType: async (req, res) => {
        try {
            await db('room_types').where('room_type_id', req.params.id).del();
            res.status(200).json(createResponse(true, null, 'Room type deleted successfully'));
        } catch (err) {
            console.error(err);
            res.status(500).json(createResponse(false, null, 'Error deleting room type'));
        }
    },

    searchRoomTypes: async (req, res) => {
        const { query } = req.query;
        try {
            const roomTypes = await db('room_types').where('type_name', 'like', `%${query}%`);
            res.status(200).json(createResponse(true, roomTypes, 'Room types searched successfully'));
        } catch (error) {
            console.error('Error searching room types:', error);
            res.status(500).json(createResponse(false, null, 'Error searching room types'));
        }
    },
};

module.exports = roomTypesController; 