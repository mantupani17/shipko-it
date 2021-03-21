const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const helmet = require("helmet");
const passport = require('passport');
const rateLimit = require("express-rate-limit");
const xss = require('xss-clean');
const _ = require('lodash')

var app = express();
// const AuthRoute = require('./routes/Auth');
const UserRoute = require('./routes/User');

// load cors module
app.use(cors());

// load helmet module for 
app.use(helmet());

// this prevents the dos attacks 
// set a limit to all kind tof requests
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);
app.use(express.json({ limit: '10kb' }));
// use xss for sanitizing the data
app.use(xss())

// use body parser
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

// mounting all the route files
app.use('/v1/api/user/', UserRoute);
// app.use('/v1/user', passport.authenticate('jwt', { session: false }), UserRoute);



app.use(passport.initialize());
app.use(passport.session());
require('./config/auth');

// ERROR-HANDLING MIDDLEWARE FOR SENDING ERROR RESPONSES TO MAINTAIN A CONSISTENT FORMAT
app.use((err, req, res, next) => {
    let responseStatusCode = 500;
    let responseObj = {
      success: 'FAILED',
      data: [],
      message: 'There was some internal server error',
    };
    // IF THERE WAS SOME ERROR THROWN BY PREVIOUS REQUEST
    if (!_.isNil(err)) {
      // IF THE ERROR IS REALTED TO JWT AUTHENTICATE, SET STATUS CODE TO 401 AND SET A CUSTOM MESSAGE FOR UNAUTHORIZED
      if (err.name === 'JsonWebTokenError') {
        responseStatusCode = 401;
        responseObj.message = 'You cannot get the details. You are not authorized to access this protected resource';
      }

      if(err.name === 'TokenExpiredError'){
        responseStatusCode = 401;
        responseObj.message = 'Sorry, session got expired.';
      }

      if(err.name === 'Error'){
        responseStatusCode = 401;
        responseObj.message = 'Unauthorized access.';
      }

    }
    
    if (!res.headersSent) {
        res.status(responseStatusCode).json(responseObj);
    }

    next();
});



module.exports = app;





