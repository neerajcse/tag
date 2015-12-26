
/**
 * Mongoose and mongodb settings.
**/
var mongoose = require('mongoose');
User_Schema = new mongoose.Schema({
	username: String,
	firstName: String,
	lastName: String,
	updated: { type: Date, default: Date.now },
	created: Date,
	_Id: Schema.Types.ObjectId,
});

Device_Schema = new mongoose.Schema({
	userName: String, 
	bluetoothAddress: String,
	type: String,
	currentLocation: String,
	toLocate: Boolean,
	reportFound: Boolean,
});

Subscription_Schema = new mongoose.Schema({
	userName: String,
	validTill: Date,
	deviceId: Schema.Types.ObjectId
});

User = mongoose.model('User', User_Schema);
Device = mongoose.model('Device', Device_Schema);
Subscription = mongoose.model('Subscription', Subscription_Schema);

mongoose.connect("mongodb://user1:titansdevil@ds043991.mongolab.com:43991/tag-neerajcse", function (error) {
    if (error) console.error(error);
    else console.log('mongo connected');
});


/**
 * Express js settings and routes.
**/
var express = require('express');
var bodyParser = require('body-parser');
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
      res.json(200, users);
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
      user.remove( function ( err, user ){
        res.json(200, {msg: 'OK'});
      });
    });
  })
  .post('/api/devices/', function(req, res) {
  	User.findById( req.body.userName, function( err, user) {
  		if(err !=null || user == null || user == undefined) {
  			res.json(404, {msg: 'User not found'});
  		} else {
  			Subscription.find({userName: user.userName, device: null}, function(err, subscriptions)) {
  				if(subscriptions.length == 0) {
  					res.json(501, 'Please add more subscriptions to add a new device.');
  				} else {
  					var device = new Device( req.body );
  					subscriptions[0].device = device._id;
  					subscriptions[0].userName = userName;
  				}
  			}
  		}
  	}))
  	.put('/api/devices/:deviceId', function(req, res) {
  		Device.findById( req.params.deviceId, function(err, device) {
  			device.type = req.body.type;
  			device.save(function(err, device) {
  				res.json(200, {msg: 'Device updated'});
  			});
  		})
  	})
  	.get('/api/devices/:deviceId', function( req, res) {
  		Device.findById( req.params.deviceId, function( err, device) {
  			res.json(200, device);
  		});
  	});
  });

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});