var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Schema = new mongoose.Schema({
  title: String,
  author: String,
  category: String,
  year: Number
});

var Book = mongoose.model('Book', Schema);

mongoose.Promise = global.Promise;

// MongoDB connect
mongoose.connect(process.env.MONGOLAB_URI, function (error) {
    if (error) console.error(error);
    else console.log('mongo connected');
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
	extended: true
}));



app.get('/books', function (req, res) {
    Book.find( function ( err, book ){
      res.status(200).json(book);
    });
  });

app.post('/books', function (req, res) {
      var newBook = Book();
      newBook.title = req.body.title;
      newBook.author = req.body.author;
      newBook.category = req.body.category;
      newBook.year = req.body.year;
      newBook.save(function(err, book) {
        if(err) {
          res.send('Error inserting Book');
        }
        else {
          console.log(book);
          res.status(200).send(book);
        }
      });
    });


app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public/style.css'));
app.use(express.static(__dirname + '/node_modules'));

// views is directory for all template files
//app.set('views', __dirname + '/views');

app.get('*', function(request, response) {
  response.sendFile('/public/index.html')
});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
