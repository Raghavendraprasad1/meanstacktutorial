const express = require('express');
const bodyparser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();
// const ageMiddleware = require('../middleware/ageMiddleware');

module.exports = (app)=>{

    app.use(bodyparser.urlencoded({extended:false}));
    app.use(bodyparser.json());
   
    // app.use(cors());
    // app.use(cors({
    //     origin: 'http://localhost:4200', // Allow requests from this origin
    //     // methods: ['GET', 'POST'],      // Allow only specified methods
    //     // allowedHeaders: ['Content-Type'], // Allow only specified headers
    //   }));

    app.use(morgan('dev')); // thirt party middleware

    // setup static files.
    app.use(express.static(path.join(__dirname, '../public')));

    // app.use(ageMiddleware);


    // error handling middleware
    app.use((err, req, res, next) =>{
        console.log(err.stack);
        res.status(500).send('something went wrong');
    });

}

