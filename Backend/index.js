const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2'); 
const app = express();
const _CONST = require('./app/config/constant')
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

require('./app/models/createTables');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'staybooker',
    port: 3306
});

db.connect((err) => {
    if (err) {
        console.error('MySQL connection error:', err);
    } else {
        console.log('Connected to MySQL.');
    }
});

const authRoute = require('./app/routers/auth');
const userRoute = require('./app/routers/user');
const newsRouter = require('./app/routers/newsRouter');
const categoriesRouter = require('./app/routers/categoriesRouter');
const hotelsRouter = require('./app/routers/hotelsRouter');
const roomTypesRouter = require('./app/routers/roomTypesRouter');
const roomsRouter = require('./app/routers/roomsRouter');
const reservationsRouter = require('./app/routers/reservationsRouter');
const passengersRouter = require('./app/routers/passengersRouter');
const bookingsRouter = require('./app/routers/bookingsRouter');
const servicesRouter = require('./app/routers/servicesRouter');
const paymentRoute = require('./app/routers/paypal');
const reviewsRouter = require('./app/routers/reviewsRouter');
const toursRouter = require('./app/routers/toursRouter');

app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/news', newsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/hotels', hotelsRouter);
app.use('/api/room-types', roomTypesRouter);
app.use('/api/rooms', roomsRouter);
app.use('/api/reservations', reservationsRouter);
app.use('/api/passengers', passengersRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/services', servicesRouter);
app.use('/api/payment', paymentRoute);
app.use('/api/reviews', reviewsRouter);
app.use('/api/tours', toursRouter);

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'API documentation for the bookstore application',
        },
        servers: [
            {
                url: 'http://localhost:3100',
            },
        ],
    },
    apis: ['./app/routers/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const PORT = process.env.PORT || _CONST.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
