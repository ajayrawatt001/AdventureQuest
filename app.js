const express = require('express');
const path = require('path');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimt = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const AppError = require('./src/utils/appError');
const globalErrorHandler = require('./src/controllers/errorController');
const tourRouter = require('./src/routes/tourRoutes');
const userRouter = require('./src/routes/userRoutes');
const reviewRouter = require('./src/routes/reviewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, './src/views'));
console.log(path.join(__dirname, './src/views'));

// Serving static files
// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, 'public')));

// 1) Global Middlware
// Set Security HTTP Headers
app.use(helmet());

// Development Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimt({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requets from this IP, please try again in an hour!',
});

app.use('/api', limiter);

// Body parser,reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

//  Data sanitization against NoSql query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.use('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Cant't find ${req.originalUrl} on this server`,
  // });

  // const err = new Error(`Cant't find ${req.originalUrl} on this server`);
  // (err.status = 'fail'), (err.statusCode = 404), next(err);

  next(new AppError(`Cant't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
