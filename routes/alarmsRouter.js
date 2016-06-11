var express     = require('express');
var bodyParser  = require('body-parser');
var Verify      = require('./verify');

var Alarms      = require('../models/alarms');

var alarmsRouter = express.Router();
alarmsRouter.use (bodyParser.json());

alarmsRouter.route('/')
.get(   Verify.verifyOrdinaryUser,     
        function (req, res, next) {
            //console.log('query' + JSON.stringify (req.query));
            Alarms.find(req.query)
                // .populate('user')
                .exec(function (err, alarm) {
                    if (err) next (err);
                    //console.log('answered' + JSON.stringify (alarm));
                    res.json(alarm);
            });
        })

.post(  Verify.verifyOrdinaryUser, 
        function (req, res, next) {
            Alarms.create(req.body, function (err, alarm) {
                if (err) {
                    // console.log("Error " + err.message);
                    next(err);
                    // new Error('cannot find event ' + req.params.id));
                    return;                    
                }
                //var id = alarm._id;

                //res.writeHead(200, {
                //    'Content-Type': 'text/plain'
                //});
                // res.end("Added alarm " + alarm.name + " with id: " + id);
                res.json(alarm);
            });
        })

.delete(Verify.verifyOrdinaryUser, 
        Verify.verifyAdmin,
        function (req, res, next) {
            Alarms.remove({}, function (err, resp) {
                if (err) next (err);
                res.json(resp);
            });
        });

alarmsRouter.route('/:alarmId')
.get(   Verify.verifyOrdinaryUser, 
        function (req, res, next) {
            Alarms.find({_id: req.params.alarmId, user: req.decoded._id})
                // .populate('user')
                .exec(function (err, alarm) {
                    if (err) { 
                        res.end('null');
                        return;
                    }
                    res.json(alarm);
                });
        })

.put(   Verify.verifyOrdinaryUser, 
        function (req, res, next) 
        {
            Alarms.findOneAndUpdate( {_id: req.params.alarmId, user: req.decoded._id}, {
                $set: req.body
            }, {
                new: true
            }, function (err, alarm) {
                if (err) next (err);
                res.json(alarm);
            });
        })

.delete(Verify.verifyOrdinaryUser, 
        function (req, res, next) 
        {
            Alarms.findOneAndRemove( 
                {_id: req.params.alarmId, user: req.decoded._id}, 
                function (err, resp) {
                    if (err) next (err);
                    res.json(resp);
                });
        });


module.exports = alarmsRouter;