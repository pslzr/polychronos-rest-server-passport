// module to access promotion Schema from MongoDb 
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

// schema
var recentSchema = new Schema({
    user:     {type: mongoose.Schema.Types.ObjectId,  required: true, ref: 'User'         },
    timer:    {type: mongoose.Schema.Types.ObjectId,  required: true, ref: 'Timer'        },
    executed: {type: Date,                            required: true, default: Date.now   },
    status:   {type: Number                                                               },
    setIdx:   {type: Number                                                               },
    intIdx:   {type: Number                                                               },
    cycle:    {type: Number                                                               },
    seconds:  {type: Number                                                               }
});

// the schema is useless so far
// we need to create a model using it
var Recent = mongoose.model('Recent', recentSchema, 'recents');

module.exports = Recent;
