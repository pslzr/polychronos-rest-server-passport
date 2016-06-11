var express     = require('express');
var bodyParser  = require('body-parser');
var Verify      = require('./verify');

var Sets   = require('../models/sets');

var setsRouter = express.Router();
setsRouter.use (bodyParser.json());

setsRouter.route('/')
.get(   Verify.verifyOrdinaryUser,     
        function (req, res, next) {
            // console.log('query' + JSON.stringify (req.query));
            Sets.find(req.query)
                .populate('user')
                .populate('alarm')
                .exec(function (err, set) {
                    if (err) next (err);
                    res.json(set);
            });
        })

.post(  Verify.verifyOrdinaryUser, 
        function (req, res, next) {
            Sets.create(req.body, function (err, set) {
                if (err) {
                    next (err);
                }
                res.json(set);
            });
        })

.delete(Verify.verifyOrdinaryUser, 
        Verify.verifyAdmin,
        function (req, res, next) {
            Sets.remove({}, function (err, resp) {
                if (err) next (err);
                res.json(resp);
            });
        });

setsRouter.route('/:setId')
.get(   Verify.verifyOrdinaryUser, 
        function (req, res, next) {
            Sets.find({_id: req.params.setId, user: req.decoded._id})
                // .populate('user')
                .exec(function (err, set) {
                    if (err) next (err);
                    
                    res.json(set);
                });
        })

.put(   Verify.verifyOrdinaryUser, 
        function (req, res, next) 
        {
            // console.log('set put ' + req.params.setId);
            // console.log('body ' + JSON.stringify (req.body));
            
            Sets.findOneAndUpdate( {_id: req.params.setId, user: req.decoded._id}, {
                $set: req.body
            }, {
                new: true
            }, function (err, modSet) {
                if (err) next (err);
                
                // console.log('changed set' + JSON.stringify (modSet));
                res.json(modSet);
            });
        })

.delete(Verify.verifyOrdinaryUser, 
        function (req, res, next) 
        {
            Sets.findOneAndRemove( 
                {_id: req.params.setId, user: req.decoded._id}, 
                function (err, resp) {
                    if (err) next (err);
                    res.json(resp);
                });
        });


module.exports = setsRouter;
