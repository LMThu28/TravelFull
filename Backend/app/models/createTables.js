const db = require('../config/db');

const createTables = async () => {
    try {
        // Tạo bảng "users" nếu chưa tồn tại
        await db.schema.hasTable('users').then(async (exists) => {
            if (!exists) {
                await db.schema.createTable('users', (table) => {
                    table.increments('id').primary();
                    table.string('email').unique().notNullable();
                    table.string('phone');
                    table.string('username');
                    table.string('password').notNullable();
                    table.string('role');
                    table.string('status').defaultTo('noactive');
                    table.string('image').defaultTo('https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png');
                    table.timestamp('created_at').defaultTo(db.fn.now());
                    table.timestamp('updated_at').defaultTo(db.fn.now());
                });
                console.log('Table "users" created.');
            } else {
                console.log('Table "users" already exists.');
            }
        });

        // Tạo bảng "password_reset_tokens" nếu chưa tồn tại
        await db.schema.hasTable('password_reset_tokens').then(async (exists) => {
            if (!exists) {
                await db.schema.createTable('password_reset_tokens', (table) => {
                    table.increments('id').primary();
                    table.integer('user_id').unsigned().notNullable();
                    table.string('token').notNullable();
                    table.timestamp('expires_at').notNullable();
                    table.timestamp('created_at').defaultTo(db.fn.now());
                    table.foreign('user_id').references('users.id');
                });
                console.log('Table "password_reset_tokens" created.');
            } else {
                console.log('Table "password_reset_tokens" already exists.');
            }
        });

        // Tạo bảng "categories" nếu chưa tồn tại
        await db.schema.hasTable('categories').then(async (exists) => {
            if (!exists) {
                await db.schema.createTable('categories', (table) => {
                    table.increments('id').primary();
                    table.string('name').unique().notNullable();
                    table.text('description');
                    table.timestamp('created_at').defaultTo(db.fn.now());
                    table.timestamp('updated_at').defaultTo(db.fn.now());
                });
                console.log('Table "categories" created.');
            } else {
                console.log('Table "categories" already exists.');
            }
        });

        // Tạo bảng "services" nếu chưa tồn tại
        await db.schema.hasTable('services').then(async (exists) => {
            if (!exists) {
                await db.schema.createTable('services', (table) => {
                    table.increments('id').primary();
                    table.string('name').notNullable();
                    table.text('description');
                    table.integer('categories_id').unsigned().references('id').inTable('categories').onDelete('CASCADE');
                    table.string('image');
                    table.timestamp('created_at').defaultTo(db.fn.now());
                    table.timestamp('updated_at').defaultTo(db.fn.now());
                    table.string('city');
                });
                console.log('Table "services" created.');
            } else {
                console.log('Table "services" already exists.');
            }
        });

        // Tạo bảng "news" nếu chưa tồn tại
        await db.schema.hasTable('news').then(async (exists) => {
            if (!exists) {
                await db.schema.createTable('news', (table) => {
                    table.increments('id').primary();
                    table.string('name').notNullable();
                    table.text('description');
                    table.string('image');
                    table.timestamp('created_at').defaultTo(db.fn.now());
                    table.timestamp('updated_at').defaultTo(db.fn.now());
                });
                console.log('Table "news" created.');
            } else {
                console.log('Table "news" already exists.');
            }
        });

        // Tạo bảng "hotels" nếu chưa tồn tại
        await db.schema.hasTable('hotels').then(async (exists) => {
            if (!exists) {
                await db.schema.createTable('hotels', (table) => {
                    table.increments('hotel_id').primary();
                    table.string('name').notNullable();
                    table.string('address').notNullable();
                    table.string('city').notNullable();
                    table.float('rating');
                    table.text('description');
                    table.string('amenities');
                    table.string('phone_number');
                    table.string('email');
                    table.string('website');
                    table.string('image'); 
                    table.integer('user_id').unsigned().references('id').inTable('users');
                    table.timestamp('created_at').defaultTo(db.fn.now());
                    table.timestamp('updated_at').defaultTo(db.fn.now());
                });
                console.log('Table "hotels" created.');
            } else {
                console.log('Table "hotels" already exists.');
            }
        });

        // Tạo bảng "room_types" nếu chưa tồn tại
        await db.schema.hasTable('room_types').then(async (exists) => {
            if (!exists) {
                await db.schema.createTable('room_types', (table) => {
                    table.increments('room_type_id').primary();
                    table.integer('hotel_id').unsigned().references('hotel_id').inTable('hotels').onDelete('CASCADE');
                    table.string('type_name').notNullable();
                    table.text('description');
                    table.string('bed_type');
                    table.integer('occupancy');
                    table.decimal('price_per_night', 10, 2);
                    table.string('amenities');
                    table.timestamp('created_at').defaultTo(db.fn.now());
                    table.timestamp('updated_at').defaultTo(db.fn.now());
                });
                console.log('Table "room_types" created.');
            } else {
                console.log('Table "room_types" already exists.');
            }
        });

        // Tạo bảng "rooms" nếu chưa tồn tại
        await db.schema.hasTable('rooms').then(async (exists) => {
            if (!exists) {
                await db.schema.createTable('rooms', (table) => {
                    table.increments('room_id').primary();
                    table.integer('hotel_id').unsigned().references('hotel_id').inTable('hotels').onDelete('CASCADE');
                    table.integer('room_type_id').unsigned().references('room_type_id').inTable('room_types').onDelete('CASCADE');
                    table.string('room_number').notNullable();
                    table.integer('floor').notNullable();
                    table.boolean('is_available').defaultTo(true);
                    table.timestamp('created_at').defaultTo(db.fn.now());
                    table.timestamp('updated_at').defaultTo(db.fn.now());
                });
                console.log('Table "rooms" created.');
            } else {
                console.log('Table "rooms" already exists.');
            }
        });

        // Tạo bảng "reservations" nếu chưa tồn tại
        await db.schema.hasTable('reservations').then(async (exists) => {
            if (!exists) {
                await db.schema.createTable('reservations', (table) => {
                    table.increments('reservation_id').primary();
                    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
                    table.integer('room_id').unsigned().references('room_id').inTable('rooms').onDelete('CASCADE');
                    table.date('check_in_date').notNullable();
                    table.date('check_out_date').notNullable();
                    table.decimal('total_price', 10, 2).notNullable();
                    table.string('status').defaultTo('pending');
                    table.timestamp('created_at').defaultTo(db.fn.now());
                    table.timestamp('updated_at').defaultTo(db.fn.now());
                });
                console.log('Table "reservations" created.');
            } else {
                console.log('Table "reservations" already exists.');
            }
        });

        // Tạo bảng "passengers" nếu chưa tồn tại
        await db.schema.hasTable('passengers').then(async (exists) => {
            if (!exists) {
                await db.schema.createTable('passengers', (table) => {
                    table.increments('passenger_id').primary();
                    table.string('name').notNullable();
                    table.string('email').notNullable();
                    table.string('phone_number');
                    table.string('passport_number');
                    table.string('nationality');
                    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
                    table.timestamp('created_at').defaultTo(db.fn.now());
                    table.timestamp('updated_at').defaultTo(db.fn.now());
                });
                console.log('Table "passengers" created.');
            } else {
                console.log('Table "passengers" already exists.');
            }
        });
        
        // Tạo bảng "reviews" nếu chưa tồn tại
        await db.schema.hasTable('reviews').then(async (exists) => {
            if (!exists) {
                await db.schema.createTable('reviews', (table) => {
                    table.increments('review_id').primary();
                    table.integer('hotel_id').unsigned().references('hotel_id').inTable('hotels').onDelete('CASCADE');
                    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
                    table.text('content').notNullable();
                    table.integer('rating').notNullable();
                    table.timestamp('created_at').defaultTo(db.fn.now());
                    table.timestamp('updated_at').defaultTo(db.fn.now());
                });
                console.log('Table "reviews" created.');
            } else {
                console.log('Table "reviews" already exists.');
            }
        });

        // Tạo bảng "tour_categories" nếu chưa tồn tại
        await db.schema.hasTable('tour_categories').then(async (exists) => {
            if (!exists) {
                await db.schema.createTable('tour_categories', (table) => {
                    table.increments('id').primary();
                    table.string('name').notNullable();
                    table.text('description');
                    table.timestamp('created_at').defaultTo(db.fn.now());
                    table.timestamp('updated_at').defaultTo(db.fn.now());
                });
                console.log('Table "tour_categories" created.');
            } else {
                console.log('Table "tour_categories" already exists.');
            }
        });

        // Tạo bảng "tours" nếu chưa tồn tại
        await db.schema.hasTable('tours').then(async (exists) => {
            if (!exists) {
                await db.schema.createTable('tours', (table) => {
                    table.increments('id').primary();
                    table.integer('category_id').unsigned().references('id').inTable('tour_categories').onDelete('CASCADE');
                    table.string('name').notNullable();
                    table.text('description');
                    table.string('image'); 
                    table.integer('duration').notNullable();
                    table.string('start_location');
                    table.string('end_location');
                    table.text('included_services');
                    table.text('excluded_services');
                    table.text('notes');
                    table.decimal('price', 10, 2).notNullable(); 
                    table.string('status').defaultTo('active');
                    table.timestamp('created_at').defaultTo(db.fn.now());
                    table.timestamp('updated_at').defaultTo(db.fn.now());
                });
                console.log('Table "tours" created.');
            } else {
                console.log('Table "tours" already exists.');
            }
        });

        // Tạo bảng "tour_schedules" nếu chưa tồn tại
        await db.schema.hasTable('tour_schedules').then(async (exists) => {
            if (!exists) {
                await db.schema.createTable('tour_schedules', (table) => {
                    table.increments('id').primary();
                    table.integer('tour_id').unsigned().references('id').inTable('tours').onDelete('CASCADE');
                    table.date('start_date').notNullable();
                    table.date('end_date').notNullable();
                    table.integer('max_participants');
                    table.integer('current_participants').defaultTo(0);
                    table.string('status').defaultTo('available');
                    table.timestamp('created_at').defaultTo(db.fn.now());
                    table.timestamp('updated_at').defaultTo(db.fn.now());
                });
                console.log('Table "tour_schedules" created.');
            } else {
                console.log('Table "tour_schedules" already exists.');
                const hasMaxParticipants = await db.schema.hasColumn('tour_schedules', 'max_participants');
                if (!hasMaxParticipants) {
                    await db.schema.alterTable('tour_schedules', (table) => {
                        table.integer('max_participants').after('end_date');
                    });
                    console.log('Column "max_participants" added to table "tour_schedules".');
                }
            }
        });

        // Tạo bảng "tour_prices" nếu chưa tồn tại
        await db.schema.hasTable('tour_prices').then(async (exists) => {
            if (!exists) {
                await db.schema.createTable('tour_prices', (table) => {
                    table.increments('id').primary();
                    table.integer('tour_id').unsigned().references('id').inTable('tours').onDelete('CASCADE');
                    table.decimal('price_adult', 10, 2).notNullable();
                    table.decimal('price_child', 10, 2);
                    table.date('start_date');
                    table.date('end_date');
                    table.timestamp('created_at').defaultTo(db.fn.now());
                    table.timestamp('updated_at').defaultTo(db.fn.now());
                });
                console.log('Table "tour_prices" created.');
            } else {
                console.log('Table "tour_prices" already exists.');
            }
        });

        // Tạo bảng "tour_bookings" nếu chưa tồn tại
        await db.schema.hasTable('tour_bookings').then(async (exists) => {
            if (!exists) {
                await db.schema.createTable('tour_bookings', (table) => {
                    table.increments('id').primary();
                    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
                    table.integer('tour_schedule_id').unsigned().references('id').inTable('tour_schedules').onDelete('CASCADE');
                    table.integer('number_of_adults').defaultTo(0);
                    table.integer('number_of_children').defaultTo(0);
                    table.decimal('total_price', 10, 2).notNullable();
                    table.string('status').defaultTo('pending');
                    table.string('payment_status').defaultTo('pending');
                    table.text('special_requests');
                    table.timestamp('created_at').defaultTo(db.fn.now());
                    table.timestamp('updated_at').defaultTo(db.fn.now());
                });
                console.log('Table "tour_bookings" created.');
            } else {
                console.log('Table "tour_bookings" already exists.');
            }
        });

    } catch (error) {
        console.error('Error creating tables:', error);
    }
};

createTables();
