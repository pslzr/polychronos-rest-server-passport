var express     = require('express');
var bodyParser  = require('body-parser');
var Verify      = require('./verify');

var Timers   = require('../models/timers');

var timersRouter = express.Router();
timersRouter.use (bodyParser.json());

timersRouter.route('/')
.get(   Verify.verifyOrdinaryUser,     
        function (req, res, next) {
            // console.log('query' + JSON.stringify (req.query));
            Timers.find(req.query)
                .populate('user')
                .populate('alarm')
                .exec(function (err, timer) {
                    if (err) next (err);
                    res.json(timer);
            });
        })

.post(  Verify.verifyOrdinaryUser, 
        function (req, res, next) {
            Timers.create(req.body, function (err, timer) {
                if (err) {
                    next (err);
                }
                console.log('timer created!');
                res.json(timer);
            });
        })

.delete(Verify.verifyOrdinaryUser, 
        Verify.verifyAdmin,
        function (req, res, next) {
            Timers.remove({}, function (err, resp) {
                if (err) next (err);
                res.json(resp);
            });
        });

timersRouter.route('/:timerId')
.get(   Verify.verifyOrdinaryUser, 
        function (req, res, next) {
            Timers.find({_id: req.params.timerId, user: req.decoded._id})
                // .populate('user')
                .exec(function (err, timer) {
                    if (err) { 
                        res.end('null');
                        return;
                    }
                    res.json(timer);
                });
        })

.put(   Verify.verifyOrdinaryUser, 
        function (req, res, next) 
        {
            Timers.findOneAndUpdate( {_id: req.params.timerId, user: req.decoded._id}, {
                $set: req.body
            }, {
                new: true
            }, function (err, timer) {
                if (err) next (err);
                res.json(timer);
            });
        })

.delete(Verify.verifyOrdinaryUser, 
        function (req, res, next) 
        {
            Timers.findOneAndRemove( 
                {_id: req.params.timerId, user: req.decoded._id}, 
                function (err, resp) {
                    if (err) next (err);
                    res.json(resp);
                });
        });


module.exports = timersRouter;