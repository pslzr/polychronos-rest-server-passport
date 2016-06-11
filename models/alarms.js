// module to access promotion Schema from MongoDb 
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

// create a schema
var alarmSchema = new Schema({
    user:           {type: mongoose.Schema.Types.ObjectId,  ref: 'User' },
    name:           {type: String,   required: true, unique: true },
    filename:       {type: String,   required: true},
    seconds:        {type: Number,   required: true, min: 0 },
    confirmed:      {type: Boolean,                  default:false},
    confSeconds:    {type: Number,                   min: 0 },
    vibrate:        {type: Boolean,                  default:false},
    volume:         {type: Number,                   min: 0 }
}, {
    timestamps:     true
});

// the schema is useless so far
// we need to create a model using it
var Alarms = mongoose.model('Alarm', alarmSchema, 'alarms');

module.exports = Alarms;
