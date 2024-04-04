var createError = require('http-errors');
var express = require('express');
const bodyParser = require('body-parser')
const morgan = require('morgan')
const path = require('path')
var app = express();
const mongoose = require('mongoose');
const cors = require("cors");
app.use(cors());

// import routes
var pdfroutes = require('./routes/pdf');


app.set('port', 5000)


// mongob connection ...........................................................................
mongoose.connect('mongodb+srv://ckramesh0006:Ramesh6453@cluster0.iqdk9lt.mongodb.net/pdfworld')
  .then(() => {
    console.log("Connected to MongoDB");
  }).catch(err => console.log(err))


// for parsing json
app.use(
  bodyParser.json({
    limit: '20mb'
  })
)

// for parsing application/x-www-form-urlencoded
app.use(
  bodyParser.urlencoded({
    limit: '20mb',
    extended: true
  })
)

app.use(morgan('dev'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/files", express.static("files"))

// use the routers
app.use('/pdf', pdfroutes);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//  start server on port 3000
app.listen(app.get('port'), function () {
  console.log('port running on port' + app.get('port'));
});

module.exports = app;
