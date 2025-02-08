const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.json());

// Middleware applied to all routes
app.use((req, res, next) => {
    console.log('Hello from the middleware');
    next(); // Go to the next middleware
    // ! If next() is not called, the request-response cycle will be stuck.
});

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// Tours Functions
const getAllTours = (req, res) => {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
    });
}
const getTour = (req, res) => {
    (req, res) => {
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
}
const createTour = (req, res) => {
    (req, res) => {
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
}
const updateTour = (req, res) => {
    (req, res) => {
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
}
const deleteTour = (req, res) => {
    (req, res) => {
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
}

// Tours routes
app.route('/api/v1/tours')
    .get(getAllTours)
    .post(createTour);

app.route('/api/v1/tours/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour);

// Server Initialization
const port = 3000;
app.listen(port, () => {
    console.log('Server is running on port 3000');
});