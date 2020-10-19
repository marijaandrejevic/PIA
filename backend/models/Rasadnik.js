const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

let Rasadnik =  new Schema({
    _id: {
        type:Schema.Types.ObjectId,
        auto:true
    },
    poljoprivrednik: {
        type:String,
        required: "Ne moze biti prazno poljoprivrednik"
    },
    naziv: {
        type:String,
        required:"Ne moze biti prazan naziv"
    },
    mesto: {
        type:String,
        required:"Ne moze biti prazno mesto"
    },
    brojZasadjenih: {
        type:Number,
        required:"Ne moze biti prazno polje"
    },
    brojSlobodnihMesta: {
        type:Number,
        required:"Ne moze biti prazno polje"
    },
    trenutnoVode: {
        type:Number,
        required:"Ne moze biti prazno polje"
    },
    trenutnaTemperatura: {
        type:Number,
        required:"Ne moze biti prazno polje"
    },
    sirina: {
        type:Number,
        required:"Ne moze biti prazno polje"
    },
    duzina: {
        type:Number,
        required:"Ne moze biti prazno polje"
    },
    raspored: {
        type:Array,
        required:"Mora biti inicijalnog rasporeda"
    }
    ,
    sadnice: {
        type:Array,
        
        required: "Mora biti inicijalnog rasporeda"

    }},

    {
        collection: 'rasadnici'
    })

    module.exports = mongoose.model('Rasadnici', Rasadnik);


