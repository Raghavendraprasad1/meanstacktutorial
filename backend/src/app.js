const express = require('express');
const configDatabase = require('./config/database');
const configExpress = require('./config/express');
const {userRoute, ocrRoutes} = require("./routes");
const cors = require('cors');
const multer = require('multer');

const app = express();


configExpress(app);
configDatabase();
app.use(cors({
    origin: 'http://localhost:4200'
}));

app.use(function (req, res, next) {
    //Enabling CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
      next();
    });

app.use("/api/user", userRoute);
app.use("/api/upload", ocrRoutes);


const PORT = process.env.PORT;
app.listen(PORT, ()=>{
    console.log(`server is running on port: ${PORT}`);
});

