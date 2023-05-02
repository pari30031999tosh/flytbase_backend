const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const loginrouter = require('./routes/loginRoutes');
const dronerouter = require('./routes/droneRoutes');
require("dotenv").config();
const PORT = 3000;

mongoose.connect('mongodb+srv://pari1999tosh:tT87vpFD@cluster0.uej21xs.mongodb.net/flytbase?retryWrites=true&w=majority')
.then(res => console.log("db connected=============="))
.catch(err => console.log('error connecting to database', err))

const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/users', loginrouter);
app.use('/drones', dronerouter);


app.listen(PORT, () => console.log("server is listening at port 3000"))