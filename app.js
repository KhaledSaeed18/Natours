const express = require('express');
const fs = require('fs');
const morgan = require('morgan');

const app = express();

// Middlewares
app.use(express.json());

// Third-party middleware (morgan)
app.use(morgan('dev'));
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

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// Tours Functions 
const getAllTours = (req, res) => {
    // Log the request time middleware
    console.log(req.requestTime);
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
    });
}
const getTour = (req, res) => {
    const id = req.params.id * 1; // Convert string to number

    // Find the tour with the given id
    const tour = tours.find(el => el.id === id);

    if (!tour || id > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    });

}
const createTour = (req, res) => {
    const id = req.params.id * 1; // Convert string to number

    // Find the tour with the given id
    const tour = tours.find(el => el.id === id);

    if (!tour || id > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    });

}
const updateTour = (req, res) => {
    const id = req.params.id * 1;

    if (id > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour: '<Updated tour here...>'
        }
    });
}
const deleteTour = (req, res) => {
    const id = req.params.id * 1;

    if (id > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
}

// Users Functions
const getAllUsers = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    });
}
const getUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    });
}
const createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    });
}
const updateUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    });
}
const deleteUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    });
}

// Tours routes
const tourRouter = express.Router();
const userRouter = express.Router();

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

tourRouter
    .route('/')
    .get(getAllTours)
    .post(createTour);

tourRouter
    .route('/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour);

// Users Routes

userRouter
    .route('/')
    .get(getAllUsers)
    .post(createUser);

userRouter
    .route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser);

// Server Initialization
const port = 3000;
app.listen(port, () => {
    console.log('Server is running on port 3000');
});