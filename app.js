const express = require('express');
const app = express();
const { dirname } = require('path');
const morgan = require('morgan');
const Patient = require('./models/patientModel');
const patientRouter = require('./routes/patientRoutes');
const globalErrorHandler = require('./controllers/patientController');



if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
};

app.use(express.json());
app.use('/api/v1/patients', patientRouter)



/*app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
*/
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
});


module.exports = app;
