const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// Middlewares
app.use(express.json());

// Middleware to serve static files
app.use(express.static(`${__dirname}/public`));

// Third-party middleware (morgan)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
// Examples: 
// GET /api/v1/tours 200 4.533 ms - 8589
// GET /api/v1/tours2 404 2.538 ms - 152

// Middlewares applied to all routes:
app.use((req, res, next) => {
    console.log('Hello from the middleware');
    next(); // Go to the next middleware
    // ! If next() is not called, the request-response cycle will be stuck.
});

app.use((req, res, next) => {
    // Add a new property to the request object
    // This property will be available in all the following middlewares and routes
    req.requestTime = new Date().toISOString();
    next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;