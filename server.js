let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let morgan = require('morgan');
let mongoose = require('mongoose');
let path = require('path');

let config = require('./server/db/config');
let PORT = process.env.port || 3000;
let http = require('http').Server(app);

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

// role routes
let roleRoute = require('./server/routes/role');
app.use('/api/role', roleRoute);

// start with index.html
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/');
});

http.listen(PORT, () => {
    console.log('Listening on ' + PORT);
});