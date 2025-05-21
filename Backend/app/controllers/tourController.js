const db = require('../config/db');
const { createResponse } = require('../helpers/utils');
const nodemailer = require('nodemailer'); // Import nodemailer

const tourController = {
    // Tour Categories
    getAllTourCategories: async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10000;
        const offset = (page - 1) * limit;

        try {
            const categories = await db('tour_categories as tc')
                .select('tc.*')
                .select(db.raw('COUNT(t.id) as tour_count'))
                .leftJoin('tours as t', 'tc.id', 't.category_id')
                .groupBy('tc.id')
                .limit(limit)
                .offset(offset);
            
            res.json(createResponse(true, categories, 'Tour categories retrieved successfully'));
        } catch (error) {
            console.log(error);
            res.status(500).json(createResponse(false, null, 'Error retrieving tour categories'));
        }
    },

    createTourCategory: async (req, res) => {
        try {
            const { name, description } = req.body;

            // Check if category with same name exists
            const existing = await db('tour_categories')
                .where('name', name)
                .first();

            if (existing) {
                return res.status(200).json(createResponse(false, null, 'Tour category with this name already exists'));
            }

            const [id] = await db('tour_categories').insert({
                name,
                description
            });

            res.status(201).json(createResponse(true, 
                { id, name, description }, 
                'Tour category created successfully'
            ));
        } catch (error) {
            console.log(error);
            res.status(500).json(createResponse(false, null, 'Error creating tour category'));
        }
    },

    getTourCategoryById: async (req, res) => {
        try {
            const categoryId = req.params.id;
            const category = await db('tour_categories')
                .where('id', categoryId)
                .first();

            if (!category) {
                return res.status(404).json(createResponse(false, null, 'Tour category not found'));
            }

            res.json(createResponse(true, category, 'Tour category retrieved successfully'));
        } catch (error) {
            console.log(error);
            res.status(500).json(createResponse(false, null, 'Error retrieving tour category'));
        }
    },

    updateTourCategory: async (req, res) => {
        try {
            const categoryId = req.params.id;
            const { name, description } = req.body;

            // Check if category exists
            const existing = await db('tour_categories')
                .where('id', categoryId)
                .first();

            if (!existing) {
                return res.status(404).json(createResponse(false, null, 'Tour category not found'));
            }

            // Check if new name conflicts with other categories
            const nameConflict = await db('tour_categories')
                .where('name', name)
                .whereNot('id', categoryId)
                .first();

            if (nameConflict) {
                return res.status(200).json(createResponse(false, null, 'Tour category with this name already exists'));
            }

            await db('tour_categories')
                .where('id', categoryId)
                .update({
                    name,
                    description
                });

            res.json(createResponse(true, null, 'Tour category updated successfully'));
        } catch (error) {
            console.log(error);
            res.status(500).json(createResponse(false, null, 'Error updating tour category'));
        }
    },

    deleteTourCategory: async (req, res) => {
        try {
            const categoryId = req.params.id;

            // Check if category exists
            const existing = await db('tour_categories')
                .where('id', categoryId)
                .first();

            if (!existing) {
                return res.status(404).json(createResponse(false, null, 'Tour category not found'));
            }

            // Check if category has associated tours
            const associatedTours = await db('tours')
                .where('category_id', categoryId)
                .first();

            if (associatedTours) {
                return res.status(200).json(createResponse(false, null, 'Cannot delete category with associated tours'));
            }

            await db('tour_categories')
                .where('id', categoryId)
                .del();

            res.json(createResponse(true, null, 'Tour category deleted successfully'));
        } catch (error) {
            console.log(error);
            res.status(500).json(createResponse(false, null, 'Error deleting tour category'));
        }
    },

    // Tours
    getAllTours: async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        try {
            // Build the query
            let query = db('tours as t')
                .select('t.*', 'tc.name as category_name')
                .leftJoin('tour_categories as tc', 't.category_id', 'tc.id');

            // --- Filtering Logic (Backend) ---
            const { category_id, min_price, max_price, min_duration, max_duration, start_location } = req.query;

            if (category_id) {
                query = query.where('t.category_id', '=', category_id);
            }
            if (min_price) {
                query = query.where('t.price', '>=', parseFloat(min_price));
            }
            if (max_price) {
                query = query.where('t.price', '<=', parseFloat(max_price));
            }
            if (min_duration) {
                query = query.where('t.duration', '>=', parseInt(min_duration));
            }
            if (max_duration) {
                query = query.where('t.duration', '<=', parseInt(max_duration));
            }
            if (start_location) {
                 // Use case-insensitive search for location
                query = query.whereRaw('LOWER(t.start_location) LIKE ?', [`%${start_location.toLowerCase()}%`]);
            }
            // --- End Filtering Logic ---

             // Get total count matching filters for pagination
             // FIX: Clear select and count specific column to avoid ONLY_FULL_GROUP_BY issue
            const countResult = await query.clone().clearSelect().count('t.id as count').first();
            const total = parseInt(countResult.count);


            // Apply limit and offset for the actual data fetch
            const tours = await query.limit(limit).offset(offset);


            res.json(createResponse(true, {
                tours,
                pagination: {
                    page,
                    limit,
                    total: total // Use filtered total count
                }
            }, 'Tours retrieved successfully'));
        } catch (error) {
            console.log(error);
            res.status(500).json(createResponse(false, null, 'Error retrieving tours'));
        }
    },

    getTourById: async (req, res) => {
        try {
            const tourId = req.params.id;
            const tour = await db('tours as t')
                .select('t.*', 'tc.name as category_name', 'tc.description as category_description')
                .leftJoin('tour_categories as tc', 't.category_id', 'tc.id')
                .where('t.id', tourId)
                .first();

            if (!tour) {
                return res.status(404).json(createResponse(false, null, 'Tour not found'));
            }

            // Get schedules for this tour
            const schedules = await db('tour_schedules')
                .where('tour_id', tourId)
                .where('start_date', '>=', db.raw('CURDATE()')) // Only get future or current schedules
                .orderBy('start_date', 'asc');

            tour.schedules = schedules;

            res.json(createResponse(true, tour, 'Tour retrieved successfully'));
        } catch (error) {
            console.log(error);
            res.status(500).json(createResponse(false, null, 'Error retrieving tour'));
        }
    },

    createTour: async (req, res) => {
        try {
            const {
                category_id,
                name,
                description,
                duration,
                start_location,
                end_location,
                included_services,
                excluded_services,
                notes,
                image,
                price
            } = req.body;

            // Validate category exists
            const category = await db('tour_categories')
                .where('id', category_id)
                .first();

            if (!category) {
                return res.status(400).json(createResponse(false, null, 'Invalid tour category'));
            }

            // Validate required fields
            if (!image) {
                return res.status(400).json(createResponse(false, null, 'Tour image is required'));
            }
            if (!name || !description || !duration || !start_location || !end_location || !price) {
                 return res.status(400).json(createResponse(false, null, 'Missing required tour fields (name, description, duration, locations, price)'));
            }
            if (price <= 0) {
                return res.status(400).json(createResponse(false, null, 'Tour price must be greater than 0'));
            }
            if (parseInt(duration) <= 0) {
                return res.status(400).json(createResponse(false, null, 'Tour duration must be positive'));
            }


            const [id] = await db('tours').insert({
                category_id,
                name,
                description,
                duration,
                start_location,
                end_location,
                included_services,
                excluded_services,
                notes,
                image,
                price
            });

            const newTour = await db('tours as t')
                .select('t.*', 'tc.name as category_name')
                .leftJoin('tour_categories as tc', 't.category_id', 'tc.id')
                .where('t.id', id)
                .first();

            res.status(201).json(createResponse(true,
                newTour,
                'Tour created successfully'
            ));
        } catch (error) {
            console.log(error);
             // Check for specific DB errors if needed, e.g., unique constraints
            res.status(500).json(createResponse(false, null, 'Error creating tour'));
        }
    },

    updateTour: async (req, res) => {
        try {
            const tourId = req.params.id;
            const {
                category_id,
                name,
                description,
                duration,
                start_location,
                end_location,
                included_services,
                excluded_services,
                notes,
                image,
                price
            } = req.body;

            // Check if tour exists
            const tour = await db('tours')
                .where('id', tourId)
                .first();

            if (!tour) {
                return res.status(404).json(createResponse(false, null, 'Tour not found'));
            }

            // If category_id is provided, validate it exists
            if (category_id) {
                const category = await db('tour_categories')
                    .where('id', category_id)
                    .first();

                if (!category) {
                    return res.status(400).json(createResponse(false, null, 'Invalid tour category'));
                }
            }

            // Validate price if provided
            if (price !== undefined && price <= 0) {
                 return res.status(400).json(createResponse(false, null, 'Tour price must be greater than 0'));
            }
            // Validate duration if provided
            if (duration !== undefined && parseInt(duration) <= 0) {
                 return res.status(400).json(createResponse(false, null, 'Tour duration must be positive'));
            }


            const updateData = {
                category_id: category_id !== undefined ? category_id : tour.category_id,
                name: name !== undefined ? name : tour.name,
                description: description !== undefined ? description : tour.description,
                duration: duration !== undefined ? duration : tour.duration,
                start_location: start_location !== undefined ? start_location : tour.start_location,
                end_location: end_location !== undefined ? end_location : tour.end_location,
                included_services: included_services !== undefined ? included_services : tour.included_services,
                excluded_services: excluded_services !== undefined ? excluded_services : tour.excluded_services,
                notes: notes !== undefined ? notes : tour.notes,
                price: price !== undefined ? price : tour.price
            };

            // Only update image if new one is provided
             if (image) {
                updateData.image = image;
            }


            await db('tours')
                .where('id', tourId)
                .update(updateData);

            // Get updated tour data
            const updatedTour = await db('tours as t')
                .select('t.*', 'tc.name as category_name')
                .leftJoin('tour_categories as tc', 't.category_id', 'tc.id')
                .where('t.id', tourId)
                .first();

            res.json(createResponse(true, updatedTour, 'Tour updated successfully'));

        } catch (error) {
            console.log(error);
            res.status(500).json(createResponse(false, null, 'Error updating tour'));
        }
    },

    deleteTour: async (req, res) => {
        try {
            const tourId = req.params.id;

            // Check if tour exists
            const tour = await db('tours')
                .where('id', tourId)
                .first();

            if (!tour) {
                return res.status(404).json(createResponse(false, null, 'Tour not found'));
            }

            // Check if tour has any schedules
            // Consider also checking for active bookings on those schedules before deleting
            const schedules = await db('tour_schedules')
                .where('tour_id', tourId)
                .first();

            if (schedules) {
                // Maybe allow deletion but warn, or require schedules to be deleted first?
                // For now, prevent deletion if schedules exist.
                return res.status(400).json(createResponse(false, null, 'Cannot delete tour with associated schedules. Delete schedules first.'));
            }

            await db('tours')
                .where('id', tourId)
                .del();

            res.json(createResponse(true, null, 'Tour deleted successfully'));
        } catch (error) {
            console.log(error);
            res.status(500).json(createResponse(false, null, 'Error deleting tour'));
        }
    },

    // Tour Schedules
    getAllTourSchedules: async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const tourId = req.query.tour_id;

        try {
            // --- Base query for filtering and counting ---
            let baseQuery = db('tour_schedules as ts');
            if (tourId) {
                baseQuery = baseQuery.where('ts.tour_id', tourId);
            }

            // --- Count total records matching the filter ---
            // FIX: Clear select and count specific column
            const countResult = await baseQuery.clone().clearSelect().count('ts.id as count').first();
            const total = parseInt(countResult.count);

            // --- Fetch data for the current page ---
            const schedules = await baseQuery // Reuse filtered query
                .select('ts.*', 't.name as tour_name')
                .leftJoin('tours as t', 'ts.tour_id', 't.id')
                .orderBy('ts.start_date', 'asc')
                .limit(limit)
                .offset(offset);

            res.json(createResponse(true, {
                schedules,
                pagination: {
                    page,
                    limit,
                    total
                }
            }, 'Tour schedules retrieved successfully'));
        } catch (error) {
            console.error("Error in getAllTourSchedules:", error);
            res.status(500).json(createResponse(false, null, 'Error retrieving tour schedules'));
        }
    },

    getTourScheduleById: async (req, res) => {
        try {
            const scheduleId = req.params.id;
            const schedule = await db('tour_schedules as ts')
                .select('ts.*', 't.name as tour_name')
                .leftJoin('tours as t', 'ts.tour_id', 't.id')
                .where('ts.id', scheduleId)
                .first();

            if (!schedule) {
                return res.status(404).json(createResponse(false, null, 'Tour schedule not found'));
            }

            res.json(createResponse(true, schedule, 'Tour schedule retrieved successfully'));
        } catch (error) {
            console.log(error);
            res.status(500).json(createResponse(false, null, 'Error retrieving tour schedule'));
        }
    },

    createTourSchedule: async (req, res) => {
        try {
            // Remove price from here, as price is on the tour itself
            const { tour_id, start_date, end_date, max_participants } = req.body;

            // Validate tour exists
            const tour = await db('tours')
                .where('id', tour_id)
                .first();

            if (!tour) {
                return res.status(400).json(createResponse(false, null, 'Invalid tour ID'));
            }

             // Validate dates
            if (!start_date || !end_date || new Date(start_date) >= new Date(end_date)) {
                return res.status(400).json(createResponse(false, null, 'Invalid start or end date. End date must be after start date.'));
            }
             // Validate start date is not in the past (optional but good practice)
             if (new Date(start_date) < new Date().setHours(0, 0, 0, 0)) {
                 return res.status(400).json(createResponse(false, null, 'Start date cannot be in the past.'));
             }

            // Validate max_participants
            if (max_participants === undefined || parseInt(max_participants) <= 0) {
                return res.status(400).json(createResponse(false, null, 'Max participants must be a positive number'));
            }


            const [id] = await db('tour_schedules').insert({
                tour_id,
                start_date,
                end_date,
                max_participants: parseInt(max_participants), // Ensure it's an integer
                current_participants: 0, // Starts with 0 participants
                status: 'available' // Default status
            });

            // Fetch the newly created schedule with tour name for response
            const newSchedule = await db('tour_schedules as ts')
                 .select('ts.*', 't.name as tour_name')
                 .leftJoin('tours as t', 'ts.tour_id', 't.id')
                 .where('ts.id', id)
                 .first();


            res.status(201).json(createResponse(true,
                newSchedule,
                'Tour schedule created successfully'
            ));
        } catch (error) {
            console.log(error);
            res.status(500).json(createResponse(false, null, 'Error creating tour schedule'));
        }
    },

    updateTourSchedule: async (req, res) => {
        try {
            const scheduleId = req.params.id;
            // Removed price handling
            const { start_date, end_date, max_participants, status } = req.body;

            // Check if schedule exists
            const schedule = await db('tour_schedules')
                .where('id', scheduleId)
                .first();

            if (!schedule) {
                return res.status(404).json(createResponse(false, null, 'Tour schedule not found'));
            }

             // Validate dates if provided, ensuring end date is after start date
             const currentStartDate = schedule.start_date;
             const currentEndDate = schedule.end_date;
             const newStartDate = start_date ? new Date(start_date) : currentStartDate;
             const newEndDate = end_date ? new Date(end_date) : currentEndDate;

             if (newStartDate >= newEndDate) {
                 return res.status(400).json(createResponse(false, null, 'End date must be after start date.'));
             }
             // Optionally check if start date is being moved to the past
             // if (start_date && newStartDate < new Date().setHours(0,0,0,0)) {
             //    return res.status(400).json(createResponse(false, null, 'Start date cannot be set to the past.'));
             // }


            // Validate max_participants if provided
            let finalMaxParticipants = schedule.max_participants;
            if (max_participants !== undefined) {
                 const newMax = parseInt(max_participants);
                 if (isNaN(newMax) || newMax <= 0) {
                    return res.status(400).json(createResponse(false, null, 'Max participants must be a positive number'));
                 }
                 // Prevent reducing max_participants below current bookings
                 if (newMax < schedule.current_participants) {
                     return res.status(400).json(createResponse(false, null, `Cannot set max participants (${newMax}) below current booked count (${schedule.current_participants})`));
                 }
                 finalMaxParticipants = newMax;
            }

             // Validate status if provided
             const validStatuses = ['available', 'fully_booked', 'cancelled'];
             let finalStatus = schedule.status; // Start with current status
             if (status !== undefined) {
                 if (!validStatuses.includes(status)) {
                     return res.status(400).json(createResponse(false, null, `Invalid schedule status. Must be one of: ${validStatuses.join(', ')}`));
                 }
                 finalStatus = status; // Use provided status if valid
            }

             // Auto-update status based on participants *if* status wasn't explicitly provided as 'cancelled'
             if (status !== 'cancelled') {
                 if (schedule.current_participants >= finalMaxParticipants) {
                     finalStatus = 'fully_booked';
                 } else {
                     finalStatus = 'available';
                 }
                 // If admin manually set to 'available' or 'fully_booked', respect that unless participants dictate otherwise
                 if (status === 'available' && schedule.current_participants >= finalMaxParticipants) finalStatus = 'fully_booked';
                 if (status === 'fully_booked' && schedule.current_participants < finalMaxParticipants) finalStatus = 'available';
             }


            // Prepare update data only for fields that changed
            const updateData = {};
            if (start_date && new Date(start_date).toISOString() !== currentStartDate.toISOString()) updateData.start_date = start_date;
            if (end_date && new Date(end_date).toISOString() !== currentEndDate.toISOString()) updateData.end_date = end_date;
            if (max_participants !== undefined && finalMaxParticipants !== schedule.max_participants) updateData.max_participants = finalMaxParticipants;
            if (finalStatus !== schedule.status) updateData.status = finalStatus;


            if (Object.keys(updateData).length === 0) {
                 // Return current data if no effective changes were made
                 return res.json(createResponse(true, schedule, 'No changes detected'));
            }

            await db('tour_schedules')
                .where('id', scheduleId)
                .update(updateData);

            // Fetch the updated schedule to return
            const updatedSchedule = await db('tour_schedules as ts')
                 .select('ts.*', 't.name as tour_name')
                 .leftJoin('tours as t', 'ts.tour_id', 't.id')
                 .where('ts.id', scheduleId)
                 .first();

            res.json(createResponse(true, updatedSchedule, 'Tour schedule updated successfully'));
        } catch (error) {
            console.log(error);
            res.status(500).json(createResponse(false, null, 'Error updating tour schedule'));
        }
    },

    deleteTourSchedule: async (req, res) => {
        try {
            const scheduleId = req.params.id;

            // Check if schedule exists
            const schedule = await db('tour_schedules')
                .where('id', scheduleId)
                .first();

            if (!schedule) {
                return res.status(404).json(createResponse(false, null, 'Tour schedule not found'));
            }

            // Check if schedule has associated bookings (consider only non-cancelled ones?)
            const associatedBookings = await db('tour_bookings')
                .where('tour_schedule_id', scheduleId)
                // .whereNot('status', 'cancelled') // Optional: Allow deleting if only cancelled bookings exist
                .first();

            if (associatedBookings) {
                return res.status(400).json(createResponse(false, null, 'Cannot delete schedule with associated bookings. Cancel bookings first.'));
            }

            await db('tour_schedules')
                .where('id', scheduleId)
                .del();

            res.json(createResponse(true, null, 'Tour schedule deleted successfully'));
        } catch (error) {
            console.log(error);
            res.status(500).json(createResponse(false, null, 'Error deleting tour schedule'));
        }
    },

    // Tour Bookings
    createTourBooking: async (req, res) => {
        // Use a try...catch block around the entire operation
        let newBooking; // Declare newBooking outside the transaction scope
        try {
            const {
                user_id, // Assuming user_id comes from authenticated user session or req body
                tour_schedule_id,
                number_of_adults = 0, // Default to 0 if not provided
                number_of_children = 0, // Default to 0 if not provided
                special_requests = '' // Default to empty string
            } = req.body;

             // Validate User ID presence (e.g., from middleware)
            if (!user_id) {
                return res.status(401).json(createResponse(false, null, 'User authentication required'));
            }

            // Validate schedule ID
            if (!tour_schedule_id) {
                 return res.status(400).json(createResponse(false, null, 'Tour schedule ID is required'));
            }

            // Check if tour schedule exists and is available
            const schedule = await db('tour_schedules as ts')
                .select(
                    'ts.id',
                    'ts.status',
                    'ts.current_participants',
                    'ts.max_participants',
                    't.price as tour_price', // Get the price from the associated tour
                    't.name as tour_name', // Get tour name for email
                    'ts.start_date', // Get start date for email
                    'ts.end_date' // Get end date for email
                )
                .leftJoin('tours as t', 'ts.tour_id', 't.id') // Join to get tour price and name
                .where('ts.id', tour_schedule_id)
                .first();

            if (!schedule) {
                return res.status(400).json(createResponse(false, null, 'Lịch trình tour không hợp lệ'));
            }

            if (schedule.status !== 'available') {
                // Provide more specific reason if fully booked
                const reason = schedule.status === 'fully_booked' ? 'đã đủ chỗ' : 'không có sẵn';
                return res.status(400).json(createResponse(false, null, `Lịch trình tour này ${reason} để đặt`));
            }

             // Validate participant numbers
             const numAdults = parseInt(number_of_adults);
             const numChildren = parseInt(number_of_children);
            if (isNaN(numAdults) || numAdults < 0 || isNaN(numChildren) || numChildren < 0) {
                 return res.status(400).json(createResponse(false, null, 'Số lượng người lớn và trẻ em phải là số không âm'));
            }
            const totalParticipants = numAdults + numChildren;
            if (totalParticipants <= 0) {
                 return res.status(400).json(createResponse(false, null, 'Tổng số lượng người tham gia phải lớn hơn 0'));
            }

            const newTotalCurrentParticipants = schedule.current_participants + totalParticipants;

            // Validate against the schedule's max_participants
            if (newTotalCurrentParticipants > schedule.max_participants) {
                const availableSlots = schedule.max_participants - schedule.current_participants;
                return res.status(400).json(createResponse(false, null, `Không đủ chỗ trống. Chỉ còn ${availableSlots} chỗ.`));
            }

            // Calculate total price (assuming price is per person, adjust if needed)
            const calculatedTotalPrice = totalParticipants * parseFloat(schedule.tour_price);
            if (isNaN(calculatedTotalPrice)) {
                 console.error(`Error calculating price for schedule ${schedule.id}. Tour price: ${schedule.tour_price}`);
                 return res.status(500).json(createResponse(false, null, 'Lỗi khi tính toán giá tour'));
            }

            // Start transaction
            await db.transaction(async (trx) => {
                // 1. Create booking
                const [bookingId] = await trx('tour_bookings').insert({
                    user_id,
                    tour_schedule_id,
                    number_of_adults: numAdults,
                    number_of_children: numChildren,
                    total_price: calculatedTotalPrice, // Use calculated price
                    special_requests,
                    status: 'pending' // Bookings start as pending
                });

                // 2. Update current participants and potentially status on the schedule
                const newStatus = newTotalCurrentParticipants >= schedule.max_participants ? 'fully_booked' : 'available';
                await trx('tour_schedules')
                    .where('id', tour_schedule_id)
                    .update({
                        current_participants: newTotalCurrentParticipants,
                        status: newStatus
                    });

                // 3. Fetch the newly created booking details FOR THE RESPONSE
                // We fetch necessary details for the email separately outside the transaction if needed
                 newBooking = await trx('tour_bookings as tb')
                    .select(
                        'tb.*',
                        't.name as tour_name', // Already fetched above
                        'ts.start_date', // Already fetched above
                        'ts.end_date' // Already fetched above
                        // Add user details if needed, but maybe not necessary for immediate response
                    )
                    .join('tour_schedules as ts', 'tb.tour_schedule_id', 'ts.id')
                    .join('tours as t', 'ts.tour_id', 't.id')
                    .where('tb.id', bookingId)
                    .first();

                // Assign fetched data needed for email (fetched before transaction or inside)
                newBooking.tour_name = schedule.tour_name;
                newBooking.start_date = schedule.start_date;
                newBooking.end_date = schedule.end_date;

            }); // Transaction commits here if no errors

            // --- Send Email Confirmation ---
            // Fetch user email AFTER transaction is successful
            const user = await db('users').where('id', user_id).first();

            if (user && user.email && newBooking) {
                try {
                    const transporter = nodemailer.createTransport({
                        host: 'smtp.gmail.com',
                        port: 587, // Correct port for TLS
                        secure: false, // true for 465, false for other ports like 587
                        auth: {
                            user: 'h5studiogl@gmail.com', // Your Gmail address
                            pass: 'ubqq hfra cduj tlnq',   // Your App Password or Gmail password (use App Password for security)
                        },
                        tls: {
                            // do not fail on invalid certs
                            rejectUnauthorized: false
                        }
                    });

                    // Format dates for email
                    const formatDate = (dateString) => {
                        if (!dateString) return 'N/A';
                        return new Date(dateString).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' });
                    };


                    await transporter.sendMail({
                        from: '"StayBooker" <h5studiogl@gmail.com>', // Sender address
                        to: user.email, // List of receivers
                        subject: 'Xác nhận đặt Tour thành công', // Subject line
                        html: `
                            <h1>Chào ${user.username || 'bạn'},</h1>
                            <p>Cảm ơn bạn đã đặt tour với StayBooker. Đặt tour của bạn đang chờ xác nhận.</p>
                            <h2>Chi tiết đặt tour:</h2>
                            <ul>
                                <li><strong>Mã đặt tour:</strong> ${newBooking.id}</li>
                                <li><strong>Tên Tour:</strong> ${newBooking.tour_name}</li>
                                <li><strong>Ngày bắt đầu:</strong> ${formatDate(newBooking.start_date)}</li>
                                <li><strong>Ngày kết thúc:</strong> ${formatDate(newBooking.end_date)}</li>
                                <li><strong>Số người lớn:</strong> ${newBooking.number_of_adults}</li>
                                <li><strong>Số trẻ em:</strong> ${newBooking.number_of_children}</li>
                                <li><strong>Tổng giá:</strong> ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(newBooking.total_price)}</li>
                                <li><strong>Yêu cầu đặc biệt:</strong> ${newBooking.special_requests || 'Không có'}</li>
                                <li><strong>Trạng thái:</strong> ${newBooking.status} (Chờ xác nhận)</li>
                            </ul>
                            <p>Chúng tôi sẽ sớm liên hệ lại với bạn để xác nhận đặt tour.</p>
                            <p>Trân trọng,</p>
                            <p>Đội ngũ StayBooker</p>
                        `, // html body
                    });
                    console.log(`Confirmation email sent successfully to ${user.email}`);
                } catch (emailError) {
                    // Log email sending error but don't fail the whole request
                    console.error(`Failed to send confirmation email to ${user.email}:`, emailError);
                    // Optionally, you could add a flag to the response indicating email failure
                }
            } else {
                 console.warn(`Could not send email: User email not found for user_id ${user_id} or booking data missing.`);
            }
            // --- End Send Email Confirmation ---


            // Send success response AFTER transaction and email attempt
                res.status(201).json(createResponse(true,
                    newBooking, // Return the full created booking object
                'Đặt tour thành công, chờ xác nhận. Email xác nhận đã được gửi (nếu có).'
                ));

        } catch (error) {
            console.log("Error during tour booking:", error);
            // Check if it's a specific constraint error or general error
            if (error.message.includes('transaction')) {
                 res.status(500).json(createResponse(false, null, 'Lỗi cơ sở dữ liệu khi tạo đặt tour.'));
            } else {
                // Use the error message from validation checks if available
                res.status(error.statusCode || 500).json(createResponse(false, null, error.message || 'Lỗi hệ thống khi tạo đặt tour'));
            }
        }
    },

    getAllTourBookings: async (req, res) => {
        // Add pagination and filtering if needed for admin view
         const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
         const { status, tour_id, user_id } = req.query; // Optional filters


        try {
             let query = db('tour_bookings as tb')
                .select(
                    'tb.id as booking_id', 'tb.status as booking_status', 'tb.created_at as booking_created_at',
                    'tb.number_of_adults', 'tb.number_of_children', 'tb.total_price', 'tb.special_requests',
                    't.id as tour_id', 't.name as tour_name',
                    'u.id as user_id', 'u.username as user_name', 'u.email as user_email', 'u.phone as user_phone',
                    'ts.id as schedule_id', 'ts.start_date', 'ts.end_date'
                )
                .join('tour_schedules as ts', 'tb.tour_schedule_id', 'ts.id')
                .join('tours as t', 'ts.tour_id', 't.id')
                .join('users as u', 'tb.user_id', 'u.id');

             // Apply filters
             if (status) query = query.where('tb.status', status);
             if (tour_id) query = query.where('ts.tour_id', tour_id);
             if (user_id) query = query.where('tb.user_id', user_id);

             // Get total count matching filters
             // FIX: Clear select and count specific column
             const countResult = await query.clone().clearSelect().count('tb.id as count').first();
             const total = parseInt(countResult.count);

             // Get paginated data
             const bookings = await query.orderBy('tb.created_at', 'desc')
                                        .limit(limit)
                                        .offset(offset);


            res.json(createResponse(true, {
                bookings,
                 pagination: { page, limit, total }
             }, 'All tour bookings retrieved successfully'));
        } catch (error) {
            console.log(error);
            res.status(500).json(createResponse(false, null, 'Error retrieving tour bookings'));
        }
    },


    getUserBookings: async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const userId = req.params.userId; // Get user ID from path parameter

        // Optional: Validate userId matches authenticated user if using auth middleware

        try {
            let query = db('tour_bookings as tb')
                .select(
                    'tb.id as booking_id', 'tb.status as booking_status', 'tb.created_at as booking_created_at',
                    'tb.number_of_adults', 'tb.number_of_children', 'tb.total_price', 'tb.special_requests',
                    't.id as tour_id', 't.name as tour_name', 't.image as tour_image', 't.description as tour_description',
                    'ts.id as schedule_id', 'ts.start_date', 'ts.end_date'
                    // Exclude user details as we are fetching for a specific user
                )
                .join('tour_schedules as ts', 'tb.tour_schedule_id', 'ts.id')
                .join('tours as t', 'ts.tour_id', 't.id')
                .where('tb.user_id', userId); // Filter by the user ID from the path

             // Get total count for this user
             // FIX: Clear select and count specific column
             const countResult = await query.clone().clearSelect().count('tb.id as count').first();
             const total = parseInt(countResult.count);

             // Get paginated bookings for this user
             const bookings = await query.orderBy('tb.created_at', 'desc')
                                        .limit(limit)
                                        .offset(offset);


            res.json(createResponse(true, {
                bookings,
                pagination: {
                    page,
                    limit,
                    total: total
                }
            }, 'User bookings retrieved successfully'));
        } catch (error) {
            console.log(error);
            res.status(500).json(createResponse(false, null, 'Error retrieving user bookings'));
        }
    },


    updateBookingStatus: async (req, res) => {
        // This might be for admin or user cancelling/confirming
        try {
            const { status } = req.body;
            const bookingId = req.params.id;
             // const userId = req.user.id; // Assuming user ID from auth middleware if needed for authorization

            if (!status) {
                 return res.status(400).json(createResponse(false, null, 'New status is required'));
            }

            // Validate status
            const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json(createResponse(false, null, `Invalid booking status. Must be one of: ${validStatuses.join(', ')}`));
            }

            // --- Transaction for safety ---
            await db.transaction(async (trx) => {
                // Find the booking and its schedule
                const booking = await trx('tour_bookings as tb')
                     .select('tb.*', 'ts.current_participants', 'ts.max_participants', 'ts.status as schedule_status')
                     .join('tour_schedules as ts', 'tb.tour_schedule_id', 'ts.id')
                     .where('tb.id', bookingId)
                     // .andWhere('tb.user_id', userId) // Optional: Ensure user owns the booking if it's a user action
                     .first();

                if (!booking) {
                    // Throw error inside transaction to trigger rollback
                    throw new Error('Booking not found or user unauthorized');
                }

                const oldStatus = booking.status;
                // Prevent updating already completed or cancelled bookings? (Optional)
                if (oldStatus === 'completed' || oldStatus === 'cancelled') {
                     throw new Error(`Cannot update status of already ${oldStatus} booking.`);
                }
                 // Prevent invalid transitions (e.g., from confirmed directly to pending?)
                 if (oldStatus === 'confirmed' && status === 'pending') {
                     throw new Error(`Cannot change confirmed booking back to pending.`);
                 }


                // --- Logic for participant count adjustment ---
                let participantsChange = 0;
                const bookingParticipants = booking.number_of_adults + booking.number_of_children;

                 // If cancelling a previously confirmed or pending booking, decrease participants
                if (status === 'cancelled' && (oldStatus === 'pending' || oldStatus === 'confirmed')) {
                    participantsChange = -bookingParticipants;
                }
                 // If confirming a previously pending booking, no change here (already accounted for on creation)
                 // If re-activating a cancelled booking (e.g., admin overrides to pending/confirmed)? - complex, handle carefully if needed

                 // Only update schedule if participants change
                if (participantsChange !== 0) {
                    const newCurrentParticipants = booking.current_participants + participantsChange;
                    // Determine new schedule status based on updated count
                    const newScheduleStatus = newCurrentParticipants >= booking.max_participants ? 'fully_booked' : 'available';

                    await trx('tour_schedules')
                        .where('id', booking.tour_schedule_id)
                        .update({
                            current_participants: newCurrentParticipants,
                            status: newScheduleStatus
                        });
                }
                // --- End participant adjustment logic ---

                // Update the booking status itself
                await trx('tour_bookings')
                    .where('id', bookingId)
                    .update({ status });

                // TODO: Add email notification logic here if desired (e.g., confirmation, cancellation emails)

                res.json(createResponse(true, { id: bookingId, status: status }, 'Booking status updated successfully'));

            }); // End transaction

        } catch (error) {
             console.log("Error updating booking status:", error.message); // Log specific error message
             // Handle specific errors like 'Booking not found' with 404
             if (error.message.includes('Booking not found')) {
                 return res.status(404).json(createResponse(false, null, error.message));
             }
             if (error.message.includes('Cannot update status') || error.message.includes('Cannot change confirmed')) {
                  return res.status(400).json(createResponse(false, null, error.message));
             }
            res.status(500).json(createResponse(false, null, 'Error updating booking status'));
        }
    },


    // Tour Statistics
    getTourStats: async (req, res) => {
        try {
            // Get total number of tours
            const [totalToursResult] = await db('tours').count('* as count');
            const totalTours = totalToursResult.count;

            // Get total number of confirmed bookings
            const [totalConfirmedBookingsResult] = await db('tour_bookings')
                .where('status', 'confirmed')
                .count('* as count');
            const totalConfirmedBookings = totalConfirmedBookingsResult.count;

            // Get total revenue from confirmed bookings
            const [totalRevenueResult] = await db('tour_bookings')
                .sum('total_price as totalRevenue');
            const totalRevenue = totalRevenueResult.totalRevenue || 0; // Default to 0 if null

            const stats = {
                totalTours,
                totalConfirmedBookings,
                totalRevenue
            };

            res.json(createResponse(true, stats, 'Tour statistics retrieved successfully'));
        } catch (error) {
            console.error("Error retrieving tour statistics:", error);
            res.status(500).json(createResponse(false, null, 'Error retrieving tour statistics'));
        }
    },

    getTourRevenueStats: async (req, res) => {
        try {
            const { period = 'month' } = req.query;
            let query;

            if (period === 'month') {
                // Get revenue for last 3 months
                query = db('tour_bookings as tb')
                    .select(
                        db.raw('DATE_FORMAT(tb.created_at, "%Y-%m") as period'),
                        db.raw('SUM(CASE WHEN tb.status = "confirmed" THEN tb.total_price ELSE 0 END) as revenue'),
                        db.raw('COUNT(CASE WHEN tb.status = "confirmed" THEN 1 END) as confirmed_bookings')
                    )
                    .where('tb.created_at', '>=', db.raw('DATE_SUB(CURDATE(), INTERVAL 3 MONTH)'))
                    .groupBy(db.raw('DATE_FORMAT(tb.created_at, "%Y-%m")'))
                    .orderBy('period', 'asc');
            } else {
                // Get revenue by year
                query = db('tour_bookings as tb')
                    .select(
                        db.raw('YEAR(tb.created_at) as period'),
                        db.raw('SUM(CASE WHEN tb.status = "confirmed" THEN tb.total_price ELSE 0 END) as revenue'),
                        db.raw('COUNT(CASE WHEN tb.status = "confirmed" THEN 1 END) as confirmed_bookings')
                    )
                    .where('tb.created_at', '>=', db.raw('DATE_SUB(CURDATE(), INTERVAL 2 YEAR)'))
                    .groupBy(db.raw('YEAR(tb.created_at)'))
                    .orderBy('period', 'asc');
            }

            const stats = await query;

            res.json(createResponse(true, {
                period,
                stats
            }, 'Tour revenue statistics retrieved successfully'));
        } catch (error) {
            console.error("Error retrieving tour revenue statistics:", error);
            res.status(500).json(createResponse(false, null, 'Error retrieving tour revenue statistics'));
        }
    }
};

module.exports = tourController; 