const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

let Subscriptions =  new Schema({
    _id: {
        type:Schema.Types.ObjectId,
        auto:true
    },
    endpoint: {
        type:String,
        
    },
    expirationTime: {
        type:Number
    },
    keys: {
       auth: {
           type:String
       },
       p256dh: {
           type:String
       }
    }
},
{
    collection: 'subscriptions'
}
);

module.exports = mongoose.model('Subscriptions', Subscriptions);