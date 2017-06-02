let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let morgan = require('morgan');
let mongoose = require('mongoose');
let path = require('path');
var busboy = require('connect-busboy');
var fileUpload = require('express-fileupload');

let config = require('./server/db/config');
let PORT = process.env.port || 3000;
let http = require('http').Server(app);

// for file upload
app.use(fileUpload());

// to parse multi-part post
app.use(busboy());

// db connection
mongoose.connect(config.database, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Connected to database.");
    }
});

// log request
app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

// role route
let roleRoute = require('./server/routes/role');
app.use('/api/role', roleRoute);

// user route
let userRoute = require('./server/routes/user');
app.use('/api/user', userRoute);

// import route
let importRoute = require('./server/routes/import');
app.use('/api/import', importRoute);

// store route
let storeRoute = require('./server/routes/store');
app.use('/api/store', storeRoute);

// start with index.html
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/');
});

http.listen(PORT, () => {
    console.log('Listening on ' + PORT);
});