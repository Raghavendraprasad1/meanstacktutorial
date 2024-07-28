
const mongoose = require('mongoose');

module.exports = ()=>{

    const connectionString = 
    process.env.DB_CONNECTION_STRING;

    mongoose.connect(connectionString)

    mongoose.connection.on('connected', ()=>{
        console.log("Database connected successfully");
    });

    mongoose.connection.on('error', (err)=>{
        console.log(`Database connection error: ${err}`);
    });

}