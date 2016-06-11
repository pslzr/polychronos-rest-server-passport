// module to access promotion Schema from MongoDb 
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

// schema
var logSchema = new Schema({
    user:           {type: mongoose.Schema.Types.ObjectId,  required: true, ref: 'User'     },
    interval:       {type: mongoose.Schema.Types.ObjectId,  required: true, ref: 'Interval' },
    executed:       {type: Date,                            required: true, default: Date.now },
    elapsed:        {type: Number,                          required: true }
});

// the schema is useless so far
// we need to create a model using it
var Log = mongoose.model('Log', timerSchema, 'logs');

module.exports = Log;
