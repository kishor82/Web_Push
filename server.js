const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

require('./model/subscribers_model');

// Load Routes
const index = require('./router');

// subscriber route load push
const push = require('./router/push');

// sunscriber route load
const subscribe = require('./router/subscriber');

// Load keys
const keys = require('./config/keys');

// Handlebars Helpers
mongoose.Promise = global.Promise;

// Mongoose Connect
mongoose.connect(keys.MongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Create Express middleware
const app = express();
app.set('trust proxy', true);

// parse application/json
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: true
}));

// Set Static directory
app.use(express.static(path.join(__dirname, 'public')));

//Set global vars
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
})

// Use Routes
app.use('/', index);
app.use('/subscribe', subscribe);
app.use('/push', push);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
})

// Error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

// Production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
})

