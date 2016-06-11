// module to access promotion Schema from MongoDb 
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var setSchema = new Schema({
    setId:        {type: mongoose.Schema.Types.ObjectId,  ref: 'Set' },
    cycles:       {type: Number,   required: true},
});

// schema
var timerSchema = new Schema({
    user:           {type: mongoose.Schema.Types.ObjectId,  required: true, ref: 'User'  },
    name:           {type: String,                          required: true, unique: true },
    sets:           [setSchema]    
});

// the schema is useless so far
// we need to create a model using it
var Timer = mongoose.model('Timer', timerSchema, 'timers');

module.exports = Timer;
