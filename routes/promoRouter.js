var express     = require('express');
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');
var Verify      = require('./verify');

var Promos      = require('../models/promotions');

var promoRouter = express.Router();
promoRouter.use(bodyParser.json());

promoRouter.route('/')
.get(   Verify.verifyOrdinaryUser, 
        function(req,res,next){
            Promos.find({}, function (err, promotion) {
                if (err) next (err);
                res.json(promotion);
            });
        })

.post(  Verify.verifyOrdinaryUser, 
        Verify.verifyAdmin, 
        function(req, res, next){
            Promos.create(req.body, function (err, promotion) {
                if (err) next (err);
                // console.log('promotion created!');
                var id = promotion._id;

                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                res.end('Added the promotion with id: ' + id);
            });
        })

.delete(    Verify.verifyOrdinaryUser, 
            Verify.verifyAdmin, 
            function(req, res, next){
                Promos.remove({}, function (err, resp) {
                    if (err) next (err);
                    res.json(resp);
                });
            });

promoRouter.route('/:id')
.get(   Verify.verifyOrdinaryUser, 
        function(req,res,next){
            Promos.findById(req.params.id, function (err, promotion) {
                if (err) next (err);
                res.json(promotion);
            });
        })

.put(   Verify.verifyOrdinaryUser, 
        Verify.verifyAdmin, 
        function(req, res, next){
            Promos.findByIdAndUpdate(req.params.id, {
                $set: req.body
            }, {
                new: true
            }, function (err, promotion) {
                if (err) next (err);
                res.json(promotion);
            });
        })

.delete(    Verify.verifyOrdinaryUser, 
            Verify.verifyAdmin, 
            function(req, res, next){
                Promos.findByIdAndRemove(req.params.id, function (err, resp) {        
                  if (err) next (err);
                    res.json(resp);
                });
            });

// now export the initialized router completely
module.exports = promoRouter;
