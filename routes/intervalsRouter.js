var express     = require('express');
var bodyParser  = require('body-parser');
var Verify      = require('./verify');

var Intervals   = require('../models/intervals');

var intervalsRouter = express.Router();
intervalsRouter.use (bodyParser.json());

intervalsRouter.route('/')
.get(   Verify.verifyOrdinaryUser,     
        function (req, res, next) {
            //console.log('query' + JSON.stringify (req.query));
            Intervals.find(req.query)
                .populate('user')
                .populate('alarm')
                .exec(function (err, interval) {
                    if (err) next (err);
                    res.json(interval);
            });
        })

.post(  Verify.verifyOrdinaryUser, 
        function (req, res, next) {
            Intervals.create(req.body, function (err, interval) {
                if (err) {
                    next(err);
                }
                Intervals.populate (interval, {path:"alarm"}, 
                            function(err, interval) { 
                    if (err) next (err);
                    res.json(interval);
                });
            });
        })

.delete(Verify.verifyOrdinaryUser, 
        Verify.verifyAdmin,
        function (req, res, next) {
            Intervals.remove({}, function (err, resp) {
                if (err) next (err);
                res.json(resp);
            });
        });

intervalsRouter.route('/:intervalId')
.get(   Verify.verifyOrdinaryUser, 
        function (req, res, next) {
            Intervals.find({_id: req.params.intervalId, user: req.decoded._id})
                // .populate('user')
                .populate('alarm')
                .exec(function (err, interval) {
                    if (err) { 
                        res.end('null');
                        return;
                    }
                    res.json(interval);
                });
        })

.put(   Verify.verifyOrdinaryUser, 
        function (req, res, next) 
        {
            Intervals.findOneAndUpdate( {_id: req.params.intervalId, user: req.decoded._id}, {
                $set: req.body
            }, {
                new: true
            }, function (err, interval) {
                if (err) next (err);
                //console.log('updating' + JSON.stringify (interval));
                
                Intervals.populate (interval, {path:"alarm"}, 
                            function(err, interval) { 
                    if (err) next (err);
                    //console.log('populated' + JSON.stringify (interval));
                    res.json(interval);
                });
            });
        })

.delete(Verify.verifyOrdinaryUser, 
        function (req, res, next) 
        {
            Intervals.findOneAndRemove( 
                {_id: req.params.intervalId, user: req.decoded._id}, 
                function (err, resp) {
                    if (err) next (err);
                    res.json(resp);
                });
        });


module.exports = intervalsRouter;