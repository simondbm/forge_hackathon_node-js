const bodyParser = require("body-parser");
const morgan = require("morgan");
const fs = require("fs");
const cors = require("cors");
const path = require('path');
const express = require('express');
const cookieSession = require('cookie-session');
const app = express();



// Morgan - For saving logs to a log file
let accessLogStream = fs.createWriteStream(__dirname + "/access.log", {
    flags: "a"
});


// my custom log format, just adding ":id" to the pre-defined "combined" format from morgan
// let loggerFormat =
//   ':id :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :req[header] :response-time ms';

let loggerFormat = `:remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]`;

app.use(morgan(loggerFormat, { stream: accessLogStream }));

// Below two functions are for showing logs on the console. Define streams for Morgan. This logs to stderr for status codes greater than 400 and stdout for status codes less than 400.
app.use(
  morgan(loggerFormat, {
    skip: function(req, res) {
      return res.statusCode < 400;
    },
    stream: process.stderr
  })
);

app.use(
  morgan(loggerFormat, {
    skip: function(req, res) {
      return res.statusCode >= 400;
    },
    stream: process.stdout
  })
);



// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));


const db = require("./models");

const PORT = process.env.PORT || 3000;

// Mongodb connection
db.mongoose
  .connect(db.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
  })
  .then(() => {
  console.log("Connected to the database!");
  })
  .catch(err => {
  console.log("Cannot connect to the database!", err);
  process.exit();
  });



// Route variables
var boilerRouter = require("./routes/boiler.routes");
app.use('/boiler', boilerRouter);


const config = require('./config');
if (config.credentials.client_id == null || config.credentials.client_secret == null) {
    console.error('Missing FORGE_CLIENT_ID or FORGE_CLIENT_SECRET env. variables.');
    return;
}


app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieSession({
    name: 'forge_session',
    keys: ['forge_secure_key'],
    maxAge: 14 * 24 * 60 * 60 * 1000 // 14 days, same as refresh token
}));
app.use(express.json({ limit: '50mb' }));
app.use('/api/forge', require('./routes/oauth'));
app.use('/api/forge', require('./routes/datamanagement'));
app.use('/api/forge', require('./routes/user'));
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.statusCode).json(err);
});
app.listen(PORT, () => { console.log(`Server listening on port ${PORT}`); });
