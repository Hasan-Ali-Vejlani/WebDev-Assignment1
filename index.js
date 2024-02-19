const createError = require('http-errors');
const express = require('express');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const router = require('./routes/index');
app.use('/', router);

app.use(function (req, res, next) {
    next(createError(404));
});

const PORT = 3000;
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});