var express     = require('express');
var bodyParser  = require('body-parser');
var Verify      = require('./verify');

var Recent   = require('../models/recents');
var Timer    = require('../models/timers');
var Set      = require('../models/sets');
var Interval = require('../models/intervals');
var Alarm    = require('../models/alarms');

var recentsRouter = express.Router();
recentsRouter.use (bodyParser.json());

recentsRouter.deepPopulate = function (recent, res) {
    Timer.populate (recent, {
        path: 'timer'
      }, function (err, recent) {
        if (err) next (err); 
        // console.log('recent', JSON.stringify(recent));
        Set.populate (recent, {
            path: 'timer.sets.setId'
            }, function (err, recent) {
                if (err) next (err); 
                // console.log('recent', JSON.stringify(recent));
                Interval.populate (recent, {
                    path: 'timer.sets.setId.intervals'
                    }, function (err, recent) {
                        if (err) next (err);
                        Alarm.populate (recent, {
                            path: 'timer.sets.setId.intervals.alarm'
                        }, function (err, recent){
                            //console.log('recent', JSON.stringify(recent));
                            res.json(recent);
                        }) 
                    }                         
                );
            });
      });
}

recentsRouter.route('/')
.get(   Verify.verifyOrdinaryUser,     
        function (req, res, next) {
            //console.log('query' + JSON.stringify (req.query));
            Recent.find(req.query)
                // .populate('user')
                .sort({'executed': -1})
                // .populate('timer')
                .exec(function (err, recent) {
                    if (err) next (err);
                    recentsRouter.deepPopulate (recent, res); 
            });
        })

.post(  Verify.verifyOrdinaryUser, 
        function (req, res, next) {
            Recent.create(req.body, function (err, recent) {
                if (err) next (err);
               recentsRouter.deepPopulate (recent, res); 
            });
        })

.delete(Verify.verifyOrdinaryUser, 
        Verify.verifyAdmin,
        function (req, res, next) {
            Recent.remove({}, function (err, resp) {
                if (err) next (err);
                res.json(resp);
            });
        });

recentsRouter.route('/:recentId')
.get(   Verify.verifyOrdinaryUser, 
        function (req, res, next) {
            Recent.find({_id: req.params.recentId, user: req.decoded._id})
                .sort({'executed': -1})
                // .populate('timer')
                .exec(function (err, recent) {
                    if (err) next (err); 
                    recentsRouter.deepPopulate (recent, res); 
                });
        })

.put(   Verify.verifyOrdinaryUser, 
        function (req, res, next) 
        {
            Recent.findOneAndUpdate( {_id: req.params.recentId, user: req.decoded._id}, {
                $set: req.body
            }, {
                new: true
            }, function (err, recent) {
                if (err) next (err);
                res.json(recent);
            });
        })

.delete(Verify.verifyOrdinaryUser, 
        function (req, res, next) 
        {
            Recent.findOneAndRemove( 
                {_id: req.params.recentId, user: req.decoded._id}, 
                function (err, resp) {
                    if (err) next (err);
                    res.json(resp);
                });
        });


module.exports = recentsRouter;