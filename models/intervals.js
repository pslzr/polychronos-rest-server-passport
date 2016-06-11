// module to access promotion Schema from MongoDb 
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

// schema
var intervalSchema = new Schema({
    user:           {type: mongoose.Schema.Types.ObjectId,  ref: 'User' },
    name:           {type: String,
                                        required: true, unique: true },
    alarm:          {type: mongoose.Schema.Types.ObjectId,  ref: 'Alarm',   
                                        required: true},
    seconds:        {type: Number,                    
                                        required: true, min: 0 }
});

// the schema is useless so far
// we need to create a model using it
var Interval  = mongoose.model('Interval', intervalSchema, 'intervals');

module.exports = Interval;
