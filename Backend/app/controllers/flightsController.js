const db = require('../config/db');
const { createResponse } = require('../helpers/utils');

const flightsController = {
    getAllFlights: async (req, res) => {
        try {
            const flights = await db('flights').select('*');
            res.status(200).json(createResponse(true, flights, 'Flights retrieved successfully'));
        } catch (err) {
            console.error(err);
            res.status(500).json(createResponse(false, null, 'Error retrieving flights'));
        }
    },

    getFlightById: async (req, res) => {
        try {
            const flight = await db('flights').where('flight_id', req.params.id).first();
            if (!flight) {
                return res.status(404).json(createResponse(false, null, 'Flight not found'));
            }
            res.status(200).json(createResponse(true, flight, 'Flight retrieved successfully'));
        } catch (err) {
            console.error(err);
            res.status(500).json(createResponse(false, null, 'Error retrieving flight'));
        }
    },

    createFlight: async (req, res) => {
        try {
            const [id] = await db('flights').insert(req.body);
            const newFlight = await db('flights').where('flight_id', id).first();
            res.status(201).json(createResponse(true, newFlight, 'Flight created successfully'));
        } catch (err) {
            console.error(err);
            res.status(500).json(createResponse(false, null, 'Error creating flight'));
        }
    },

    updateFlight: async (req, res) => {
        try {
            await db('flights').where('flight_id', req.params.id).update(req.body);
            const updatedFlight = await db('flights').where('flight_id', req.params.id).first();
            res.status(200).json(createResponse(true, updatedFlight, 'Flight updated successfully'));
        } catch (err) {
            console.error(err);
            res.status(500).json(createResponse(false, null, 'Error updating flight'));
        }
    },

    deleteFlight: async (req, res) => {
        try {
            await db('flights').where('flight_id', req.params.id).del();
            res.status(200).json(createResponse(true, null, 'Flight deleted successfully'));
        } catch (err) {
            console.error(err);
            res.status(500).json(createResponse(false, null, 'Error deleting flight'));
        }
    },

    searchFlights: async (req, res) => {
        const { query } = req.query;

        try {
            const flights = await db('flights')
                .where('flight_number', 'like', `%${query}%`);
            if (flights.length === 0) {
                return res.status(404).json(createResponse(false, null, 'No flights found with the given flight number'));
            }
            res.status(200).json(createResponse(true, flights, 'Flights searched successfully'));
        } catch (error) {
            console.error('Error searching flights:', error);
            res.status(500).json(createResponse(false, null, 'Error searching flights'));
        }
    },

    searchFlightsByCriteria: async (req, res) => {
        const { departure_airport_id, arrival_airport_id, departure_time } = req.query;
        try {
            const flights = await db('flights')
                .where('departure_airport_id', departure_airport_id)
                .andWhere('arrival_airport_id', arrival_airport_id)
                .andWhere(db.raw('DATE(departure_time) = ?', [departure_time]))
            if (flights.length === 0) {
                return res.status(404).json(createResponse(false, null, 'No flights found matching the criteria'));
            }
            res.status(200).json(createResponse(true, flights, 'Flights searched successfully'));
        } catch (error) {
            console.error('Error searching flights:', error);
            res.status(500).json(createResponse(false, null, 'Error searching flights'));
        }
    },
};

module.exports = flightsController; 