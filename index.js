var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Book = require('./Book');
var User = require('./User');
// bcrypt library
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
  //console.log(user);
  //newUser.password = newUser.generateHash(req.body.password);
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(req.body.password, salt, function(err, hash) {
        newUser.password = hash;
        // console.log(hash);
        newUser.save(function (err, user) {
            res.status(200).send(user);
        });
    });
  });
});

// Check if the user inserted the right credentials
app.post('/signin', findUser);

// find the user
function findUser(req, res) {
 // bind to pass parameters to callback function
 /* Bind: method creates a new function that, when called,
 has its this keyword set to the provided value,
 with a given sequence of arguments preceding any
 provided when the new function is called */
 User.findOne({username : req.body.username}, checkPassword.bind({req:req}));
}

function checkPassword(err, user) {
  if (err) {
    console.log('Error');
  }
  else {
    // if the user exists
    // check the hash of this password
    bcrypt.compare(this.req.body.password, user.password, checkIdentity);
    // console.log(user.password);
    // res.status(200);
  }
}

// Check Identity
function checkIdentity(err, res) {
  if(res) {
    // Passwords match
    console.log('Right Password');
  }
  else {
    // Passwords don't match
    console.log('Wrong Password');
  }
}

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
