var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Schema = new mongoose.Schema({
  title: String,
  author: String,
  category: String
});

var Book = mongoose.model('Book', Schema);

// MongoDB connect
mongoose.connect(process.env.MONGODB_URI, function (error) {
    if (error) console.error(error);
    else console.log('mongo connected');
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
	extended: true
}));

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');

app.get('/', function(request, response) {
  response.send('/public/index.html')
});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


