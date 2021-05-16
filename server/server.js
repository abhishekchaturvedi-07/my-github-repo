const express = require('express');
const morgan = require('morgan');
// to show the body data in server -> bodyparser
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Database Cloud Mongoose Connect
mongoose
    .connect(process.env.DATABASE_CLOUD, 
        // to remove deprecation warnings
        { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database connected from Mongo Atlas database...'))
    .catch(err => console.log(err));

//importing Route
const authRoutes = require('./routes/auth')

// apply app middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
// app.use(cors()); // any domain can access our server api
//for explicit access to particular domain
app.use(cors({origin: process.env.CLIENT_URL}));


// middlewares
app.use('/api', authRoutes)

//define port
const port = process.env.PORT || 8000;

// listening the port
app.listen(port, () => {
    console.log(`API is running on port ${port}...`)
});
