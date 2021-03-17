const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Narudzbine = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        auto: true
    },
    poljoprivrednik: {
        type:String
    },
    preduzece: {
        type:String
    },
    proizvodi: {
        type:Array
    },
    datumNarudzbine: {
        type:Date
    },
    status: {
        type:String
    },
    rasadnik: {
        type:String
    }




}
    ,

    {
        collection: 'narudzbine'
    })

module.exports = mongoose.model('Narudzbine', Narudzbine);