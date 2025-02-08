const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');

// console.log(app.get('env')); // development

// console.log(process.env); // { ... }

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Server is running on port 3000');
});