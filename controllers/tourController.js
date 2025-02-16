const Tour = require('./../models/tourModel');

exports.getAllTours = async (req, res) => {
    try {
        // Build the query  
        const queryObj = { ...req.query }; // Copy the query object (destructuring)

        // Exclude fields from the query
        const excludedFields = ['page', 'sort', 'limit', 'fields'];

        // Remove the excluded fields from the query object
        excludedFields.forEach(el => delete queryObj[el]);

        // Advanced filtering
        let queryStr = JSON.stringify(queryObj);
        // Replace the operators with the MongoDB operators ($gte, $gt, $lte, $lt)
        queryStr = queryStr.replace(
            /\b(gte|gt|lte|lt)\b/g,
            match => `$${match}`
        );

        // Find documents in the collection
        // Parse the query string to a JSON object and find the documents
        let query = Tour.find(JSON.parse(queryStr));

        // Sorting
        if (req.query.sort) {
            // Sort the documents by the given fields
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            // Default sorting, sort by creation date in descending order
            query = query.sort('-createdAt');
        }

        // Field limiting
        if (req.query.fields) {
            // Select the fields to return
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        } else {
            // Exclude the __v field by default
            query = query.select('-__v');
        }

        // Pagination
        const page = req.query.page * 1 || 1; // Convert the string to a number, default page is 1
        const limit = req.query.limit * 1 || 100; // Convert the string to a number, default limit is 100
        const skip = (page - 1) * limit; // Number of documents to skip

        query = query.skip(skip).limit(limit);

        if (req.query.page) {
            // Count the total number of documents
            const numTours = await Tour.countDocuments();
            if (skip >= numTours) throw new Error('This page does not exist');
        }

        // Execute the query
        const tours = await query;

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