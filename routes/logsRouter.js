var express     = require('express');
var bodyParser  = require('body-parser');
var Verify      = require('./verify');

var Logs        = require('../models/logs');

var logsRouter = express.Router();
logsRouter.use (bodyParser.json());

logsRouter.route('/')
.get(   Verify.verifyOrdinaryUser,     
        function (req, res, next) {
            //console.log('query' + JSON.stringify (req.query));
            Logs.find(req.query)
                .populate('user')
                .populate('alarm')
                .exec(function (err, log) {
                    if (err) next (err);
                    res.json(log);
            });
        })

.post(  Verify.verifyOrdinaryUser, 
        function (req, res, next) {
            Logs.create(req.body, function (err, log) {
                if (err) {
                    next (err);
                }
                // console.log('log created!');
                var id = log._id;

                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                res.end("Added log " + log.name + " with id: " + id);
            });
        })

.delete(Verify.verifyOrdinaryUser, 
        Verify.verifyAdmin,
        function (req, res, next) {
            Logs.remove({}, function (err, resp) {
                if (err) next (err);
                res.json(resp);
            });
        });

LogsRouter.route('/:logId')
.get(   Verify.verifyOrdinaryUser, 
        function (req, res, next) {
            Logs.find({_id: req.params.logId, user: req.decoded._id})
                // .populate('user')
                .exec(function (err, log) {
                    if (err) { 
                        res.end('null');
                        return;
                    }
                    res.json(log);
                });
        })

.put(   Verify.verifyOrdinaryUser, 
        function (req, res, next) 
        {
            Logs.findOneAndUpdate( {_id: req.params.logId, user: req.decoded._id}, {
                $set: req.body
            }, {
                new: true
            }, function (err, log) {
                if (err) next (err);
                res.json(log);
            });
        })

.delete(Verify.verifyOrdinaryUser, 
        function (req, res, next) 
        {
            Logs.findOneAndRemove( 
                {_id: req.params.logId, user: req.decoded._id}, 
                function (err, resp) {
                    if (err) next (err);
                    res.json(resp);
                });
        });


module.exports = logsRouter;