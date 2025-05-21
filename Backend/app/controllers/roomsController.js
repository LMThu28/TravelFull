const db = require('../config/db');
const { createResponse } = require('../helpers/utils');

const roomsController = {
    getAllRooms: async (req, res) => {
        try {
            const rooms = await db('rooms').select('*');
            res.status(200).json(createResponse(true, rooms, 'Rooms retrieved successfully'));
        } catch (err) {
            console.error(err);
            res.status(500).json(createResponse(false, null, 'Error retrieving rooms'));
        }
    },

    getRoomById: async (req, res) => {
        try {
            const room = await db('rooms').where('room_id', req.params.id).first();
            if (!room) {
                return res.status(404).json(createResponse(false, null, 'Room not found'));
            }
            res.status(200).json(createResponse(true, room, 'Room retrieved successfully'));
        } catch (err) {
            console.error(err);
            res.status(500).json(createResponse(false, null, 'Error retrieving room'));
        }
    },

    createRoom: async (req, res) => {
        try {
            const [id] = await db('rooms').insert(req.body);
            const newRoom = await db('rooms').where('room_id', id).first();
            res.status(201).json(createResponse(true, newRoom, 'Room created successfully'));
        } catch (err) {
            console.error(err);
            res.status(500).json(createResponse(false, null, 'Error creating room'));
        }
    },

    updateRoom: async (req, res) => {
        try {
            await db('rooms').where('room_id', req.params.id).update(req.body);
            const updatedRoom = await db('rooms').where('room_id', req.params.id).first();
            res.status(200).json(createResponse(true, updatedRoom, 'Room updated successfully'));
        } catch (err) {
            console.error(err);
            res.status(500).json(createResponse(false, null, 'Error updating room'));
        }
    },

    deleteRoom: async (req, res) => {
        try {
            await db('rooms').where('room_id', req.params.id).del();
            res.status(200).json(createResponse(true, null, 'Room deleted successfully'));
        } catch (err) {
            console.error(err);
            res.status(500).json(createResponse(false, null, 'Error deleting room'));
        }
    },

    searchRooms: async (req, res) => {
        const { query } = req.query;
        try {
            const rooms = await db('rooms').where('room_number', 'like', `%${query}%`);
            res.status(200).json(createResponse(true, rooms, 'Rooms searched successfully'));
        } catch (error) {
            console.error('Error searching rooms:', error);
            res.status(500).json(createResponse(false, null, 'Error searching rooms'));
        }
    },
};

module.exports = roomsController; 