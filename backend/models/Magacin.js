const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Magacin = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        auto: true
    },
    rasadnik: {
        type: String,
        required: "Mora biti vezan za rasadnik"
    },
    proizvodi: {
        type: Array
    },
    naruceniProizvodi: {
        type: Array
    }},

    {
        collection: 'magacini'
    })

module.exports = mongoose.model('Magacini', Magacin);