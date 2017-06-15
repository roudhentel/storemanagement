let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let morgan = require('morgan');
let mongoose = require('mongoose');
let path = require('path');
var busboy = require('connect-busboy');
var fileUpload = require('express-fileupload');

let config = require('./server/db/config');
let PORT = process.env.port || 3100;
let http = require('http').Server(app);

// let keypress = require('keypress');

// keypress(process.stdin);
// process.stdin.on('keypress', function (ch, key) {
//     console.log(key);
// });

var stdin = process.stdin;
stdin.setRawMode(true);

stdin.on('keypress', function (chunk, key) {
    process.stdout.write('Get Chunk: ' + chunk + '\n');
    if (key && key.ctrl && key.name == 'c') process.exit();
})

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

let fileSystemRoute = require('./server/routes/filesystem');
app.use('/api/filesystem', fileSystemRoute);

// start with index.html
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/');
});

http.listen(PORT, () => {
    console.log('Listening on ' + PORT);
});