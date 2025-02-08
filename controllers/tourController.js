const fs = require('fs');

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.getAllTours = (req, res) => {
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

exports.getTour = (req, res) => {
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

exports.createTour = (req, res) => {
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

exports.updateTour = (req, res) => {
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

exports.deleteTour = (req, res) => {
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