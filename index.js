
/**
 * Mongoose and mongodb settings.
**/
var mongoose = require('mongoose');
User_Schema = new mongoose.Schema({
	username: String,
	firstName: String,
	lastName: String
});

User = mongoose.model('User', User_Schema);

mongoose.connect("mongodb://user1:titansdevil@ds043991.mongolab.com:43991/tag-neerajcse", function (error) {
    if (error) console.error(error);
    else console.log('mongo connected');
});


/**
 * Express js settings and routes
**/
var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .get('/api', function (req, res) {
    res.json(200, {msg: 'OK' });
  })
  .get('/api/users', function (req, res) {
    User.find( function ( err, users ){
      res.json(200, todos);
    });
  })
  .post('/api/user', function (req, res) {
    var newUser = new User( req.body );
    newUser.id = newUser._id;
    newUser.save(function (err) {
      res.json(200, newUser);
    });
  })
  .del('/api/user', function (req, res) {
    // http://mongoosejs.com/docs/api.html#query_Query-remove
    User.remove({ userName: req.params.username}, function ( err ) {
      res.json(200, {msg: 'OK'});
    });
  })
  .get('/api/user/:id', function (req, res) {
    User.findById( req.params.id, function ( err, user ) {
      res.json(200, user);
    });
  })
  .put('/api/user/:id', function (req, res) {
    // http://mongoosejs.com/docs/api.html#model_Model.findById
    User.findById( req.params.id, function ( err, user ) {
      user.firstName = req.body.firstName;
      user.lastName = req.body.lastName;
      // http://mongoosejs.com/docs/api.html#model_Model-save
      user.save( function ( err, user ){
        res.json(200, user);
      });
    });
  })
  .del('/api/user/:id', function (req, res) {
    // http://mongoosejs.com/docs/api.html#model_Model.findById
    User.findById( req.params.id, function ( err, user ) {
      // http://mongoosejs.com/docs/api.html#model_Model.remove
      todo.remove( function ( err, user ){
        res.json(200, {msg: 'OK'});
      });
    });
  });

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});