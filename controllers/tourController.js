const Tour = require('./../models/tourModel');

exports.getAllTours = async (req, res) => {
    try {
        // Find all documents in the collection
        const tours = await Tour.find()

        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
}

exports.getTour = async (req, res) => {
    try {
        // Find by ID is a shorthand for findOne({ _id: req.params.id })
        // Find one document in the collection
        const tour = await Tour.findById(req.params.id);

        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
}

exports.createTour = async (req, res) => {
    // const newTour = new Tour({});
    // newTour.save();
    // OR:
    // Tour.create({});
    try {
        const newTour = await Tour.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });

    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }
}

exports.updateTour = async (req, res) => {
    try {
        // Find by ID and update
        const tour = await Tour.findByIdAndUpdate(
            req.params.id, // ID of the document to update
            req.body, // Data to update
            {
                new: true, // Return the modified document not the original
                runValidators: true // Run validators
            }
        );

        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
}

exports.deleteTour = (req, res) => {
    // res.status(204).json({
    //     status: 'success',
    //     data: null
    // });
}