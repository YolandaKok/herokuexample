var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Book = require('./Book');
var User = require('./User');
var bcrypt = require('bcrypt');

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

// Sign up method with encryption of the password

app.post('/signup', function (req, res) {
  // Create a new user
  var newUser = User();
  newUser.username = req.body.username;
  newUser.save(function(err, user) {
    if(err) {
      res.send('Error in sign up');
    }
    else {
      //console.log(user);
      //newUser.password = newUser.generateHash(req.body.password);
      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(req.body.password, salt, function(err, hash) {
            newUser.password = hash;
            newUser.save(function (err, user1) {
                res.status(200).send(user1);
            });
        });
      });
    }
  });
});

// Check if the user inserted the right credentials
app.post('/signin', function (req, res) {
  // find if the user exists
  User.findOne({username : req.body.username}, function (err, user) {
    if (err) {
      console.log('Error');
    }
    else {
      // if the user exists
      // check the hash of this password
      bcrypt.compare(req.body.password, user.password, function(err, res) {
        if(res) {
          // Passwords match
          console.log('Right Password');
        }
        else {
          // Passwords don't match
          console.log('Wrong Password');
        }
      });
      // console.log(user.password);
      // res.status(200);
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
