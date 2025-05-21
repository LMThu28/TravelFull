const db = require('../config/db');
const { createResponse } = require('../helpers/utils');

const passengersController = {
    getAllPassengers: async (req, res) => {
        try {
            const passengers = await db('passengers').select('*');
            res.status(200).json(createResponse(true, passengers, 'Passengers retrieved successfully'));
        } catch (err) {
            console.error(err);
            res.status(500).json(createResponse(false, null, 'Error retrieving passengers'));
        }
    },

    getPassengerById: async (req, res) => {
        try {
            const passenger = await db('passengers').where('passenger_id', req.params.id).first();
            if (!passenger) {
                return res.status(404).json(createResponse(false, null, 'Passenger not found'));
            }
            res.status(200).json(createResponse(true, passenger, 'Passenger retrieved successfully'));
        } catch (err) {
            console.error(err);
            res.status(500).json(createResponse(false, null, 'Error retrieving passenger'));
        }
    },

    createPassenger: async (req, res) => {
        try {
            const [id] = await db('passengers').insert(req.body);
            const newPassenger = await db('passengers').where('passenger_id', id).first();
            res.status(201).json(createResponse(true, newPassenger, 'Passenger created successfully'));
        } catch (err) {
            console.error(err);
            res.status(500).json(createResponse(false, null, 'Error creating passenger'));
        }
    },

    updatePassenger: async (req, res) => {
        try {
            await db('passengers').where('passenger_id', req.params.id).update(req.body);
            const updatedPassenger = await db('passengers').where('passenger_id', req.params.id).first();
            res.status(200).json(createResponse(true, updatedPassenger, 'Passenger updated successfully'));
        } catch (err) {
            console.error(err);
            res.status(500).json(createResponse(false, null, 'Error updating passenger'));
        }
    },

    deletePassenger: async (req, res) => {
        try {
            await db('passengers').where('passenger_id', req.params.id).del();
            res.status(200).json(createResponse(true, null, 'Passenger deleted successfully'));
        } catch (err) {
            console.error(err);
            res.status(500).json(createResponse(false, null, 'Error deleting passenger'));
        }
    },

    searchPassengers: async (req, res) => {
        const { query } = req.query;
        try {
            const passengers = await db('passengers').where('name', 'like', `%${query}%`);
            res.status(200).json(createResponse(true, passengers, 'Passengers searched successfully'));
        } catch (error) {
            console.error('Error searching passengers:', error);
            res.status(500).json(createResponse(false, null, 'Error searching passengers'));
        }
    },

    getPassengersByUserId: async (req, res) => {
        const { user_id } = req.params;
        try {
            const passengers = await db('passengers').where('user_id', user_id);
            res.status(200).json(createResponse(true, passengers, 'Passengers retrieved successfully'));
        } catch (err) {
            console.error(err);
            res.status(500).json(createResponse(false, null, 'Error retrieving passengers'));
        }
    },
};

module.exports = passengersController; 