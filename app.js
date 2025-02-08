const express = require('express');

const app = express();


app.get('/', (req, res) => {
    res
        .status(200)
        .json({
            message: 'Hello World'
        });
});

app.post('/', (req, res) => {
    res
        .status(200)
        .json({
            message: 'You have sent a POST request'
        });
});

const port = 3000;
app.listen(port, () => {
    console.log('Server is running on port 3000');
});