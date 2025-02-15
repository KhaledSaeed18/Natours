const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
dotenv.config({ path: '.env' });
const Tour = require('../../models/tourModel');

mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => console.log('Database Connected Successfully'))
    .catch(err => console.log(err));

// Read JSON file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

// Import data into database
const importData = async () => {
    try {
        await Tour.create(tours);
        console.log('Data successfully loaded');
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

// Delete all data from collection
const deleteData = async () => {
    try {
        await Tour.deleteMany(); // delete all documents
        console.log('Data successfully deleted');
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

// node dev-data/data/import-dev-data.js --import
// node dev-data/data/import-dev-data.js --delete
// Read the command line argument and call the appropriate function
if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}