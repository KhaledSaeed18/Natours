const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
dotenv.config({ path: '.env' });

const app = require('./app');

// console.log(app.get('env')); // development
// console.log(process.env); // { ... }

mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => console.log('Database Connected Successfully'))
    .catch(err => console.log(err));

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Server is running on port 3000');
});