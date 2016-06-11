// module to access promotion Schema from MongoDb 
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

// schema
var setSchema = new Schema({
    user:           {type: mongoose.Schema.Types.ObjectId,  ref: 'User',      required: true  },
    name:           {type: String,   required: true, unique: true },
    intervals:      [{type: mongoose.Schema.Types.ObjectId,  ref: 'Interval' }]    
});

// the schema is useless so far
// we need to create a model using it
var Set = mongoose.model('Set', setSchema, 'sets');

module.exports = Set;
