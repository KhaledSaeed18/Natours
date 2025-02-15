const Tour = require('./../models/tourModel');

exports.getAllTours = (req, res) => {
    // Log the request time middleware
    // console.log(req.requestTime);
    // res.status(200).json({
    //     status: 'success',
    //     results: tours.length,
    //     data: {
    //         tours
    //     }
    // });
}

exports.getTour = (req, res) => {
    // res.status(200).json({
    //     status: 'success',
    //     data: {
    //         tour
    //     }
    // });
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

exports.updateTour = (req, res) => {
    // res.status(200).json({
    //     status: 'success',
    //     data: {
    //         tour: '<Updated tour here...>'
    //     }
    // });
}

exports.deleteTour = (req, res) => {
    // res.status(204).json({
    //     status: 'success',
    //     data: null
    // });
}