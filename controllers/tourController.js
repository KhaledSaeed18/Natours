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
            },
            // { // Match stage, stage 4
            //     $match: { (Remove the easy difficulty)
            //         _id: {
            //             $ne: 'EASY' // Exclude the easy difficulty
            //         }
            // }
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

exports.getMonthlyPlan = async (req, res) => {
    try {
        const year = req.params.year * 1; // Convert the string to a number

        const plan = await Tour.aggregate([
            { // Unwind stage, stage 1
                $unwind: '$startDates' // Deconstruct the startDates array
            },
            { // Match stage, stage 2
                $match: {
                    startDates: { // Filter documents with startDates in the given year
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                    }
                }
            },
            { // Group stage, stage 3
                $group: {
                    _id: { // Group by month
                        $month: '$startDates'
                    },
                    numTourStarts: {
                        $sum: 1 // Count the number of documents in each group
                    },
                    tours: {
                        $push: '$name' // Push the name field to the tours array
                    }
                }
            },
            { // AddFields stage, stage 4
                $addFields: {
                    month: '$_id' // Add the month field with the value of _id
                }
            },
            { // Project stage, stage 5
                $project: {
                    _id: 0 // Exclude the _id field
                }
            },
            { // Sort stage, stage 6
                $sort: {
                    numTourStarts: -1 // Sort by numTourStarts in descending order
                }
            },
            { // Limit stage, stage 7
                $limit: 12 // Limit the number of documents to 12
            }
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                plan
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
}
