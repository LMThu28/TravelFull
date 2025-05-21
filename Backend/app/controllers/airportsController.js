const db = require('../config/db');
const { createResponse } = require('../helpers/utils');

const airportsController = {
    getAllAirports: async (req, res) => {
        try {
            const airports = await db('airports').select('*');
            res.status(200).json(createResponse(true, airports, 'Airports retrieved successfully'));
        } catch (err) {
            console.error(err);
            res.status(500).json(createResponse(false, null, 'Error retrieving airports'));
        }
    },

    getAirportById: async (req, res) => {
        try {
            const airport = await db('airports').where('airport_id', req.params.id).first();
            if (!airport) {
                return res.status(404).json(createResponse(false, null, 'Airport not found'));
            }
            res.status(200).json(createResponse(true, airport, 'Airport retrieved successfully'));
        } catch (err) {
            console.error(err);
            res.status(500).json(createResponse(false, null, 'Error retrieving airport'));
        }
    },

    createAirport: async (req, res) => {
        try {
            const [id] = await db('airports').insert(req.body);
            const newAirport = await db('airports').where('airport_id', id).first();
            res.status(201).json(createResponse(true, newAirport, 'Airport created successfully'));
        } catch (err) {
            console.error(err);
            res.status(500).json(createResponse(false, null, 'Error creating airport'));
        }
    },

    updateAirport: async (req, res) => {
        try {
            await db('airports').where('airport_id', req.params.id).update(req.body);
            const updatedAirport = await db('airports').where('airport_id', req.params.id).first();
            res.status(200).json(createResponse(true, updatedAirport, 'Airport updated successfully'));
        } catch (err) {
            console.error(err);
            res.status(500).json(createResponse(false, null, 'Error updating airport'));
        }
    },

    deleteAirport: async (req, res) => {
        try {
            await db('airports').where('airport_id', req.params.id).del();
            res.status(200).json(createResponse(true, null, 'Airport deleted successfully'));
        } catch (err) {
            console.error(err);
            res.status(500).json(createResponse(false, null, 'Error deleting airport'));
        }
    },

    searchAirports: async (req, res) => {
        const { query } = req.query;
        try {
            const airports = await db('airports').where('name', 'like', `%${query}%`);
            res.status(200).json(createResponse(true, airports, 'Airports searched successfully'));
        } catch (error) {
            console.error('Error searching airports:', error);
            res.status(500).json(createResponse(false, null, 'Error searching airports'));
        }
    },
};

module.exports = airportsController; 