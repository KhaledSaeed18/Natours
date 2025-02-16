const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');

exports.getAllTours = async (req, res) => {
    try {
        const features = new APIFeatures(
            Tour.find(),
            req.query
        ).filter().sort().limitFields().paginate();

        // Execute the query
        const tours = await features.query;

        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours
            }
        });
    } catch (err) {
        console.log(err);
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
}

exports.aliasTopTours = (req, res, next) => {
    // Middleware to add query parameters to the request
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
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

exports.deleteTour = async (req, res) => {
    try {
        // Find by ID and delete
        await Tour.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
}

exports.getTourStats = async (req, res) => {
    try {
        // Aggregation pipeline
        // aggregate() is a method that returns an aggregate object, used to define the aggregation pipeline
        const stats = await Tour.aggregate([
            { // Match stage, stage 1
                $match: {
                    ratingsAverage: { // Filter documents with ratingsAverage >= 4.5
                        $gte: 4.5
                    }
                }
            },
            { // Group stage, stage 2
                $group: {
                    _id: {
                        $toUpper: '$difficulty' // Group by difficulty
                    },
                    numTours: {
                        $sum: 1 // Count the number of documents in each group
                    },
                    numRatings: {
                        $sum: '$ratingsQuantity' // Sum the ratingsQuantity field
                    },
                    avgRating: {
                        $avg: '$ratingsAverage' // Calculate the average of the ratingsAverage field
                    },
                    avgPrice: {
                        $avg: '$price' // Calculate the average of the price field
                    },
                    minPrice: {
                        $min: '$price' // Calculate the minimum of the price field
                    },
                    maxPrice: {
                        $max: '$price' // Calculate the maximum of the price field
                    }
                }
            },
            { // Sort stage, stage 3
                $sort: {
                    avgPrice: 1 // Sort by average price in ascending order
                }
            }
        ]);
        res.status(200).json({
            status: 'success',
            data: {
                stats
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
}
