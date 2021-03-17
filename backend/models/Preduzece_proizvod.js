const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Preduzece_proizvodi = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        auto: true
    },
    naziv: {
        type: String
        
    },
    proizvodjac: {
        type: String
    },
    kolicina: {
        type: Number
    },
    tipProizvoda: {
        type: String
    },
    //za preparate maxNapredak koliko moze da ubrza, a za sadnice koliko je max treba da napreduje da bi postojala mogucnost da se izvadi iz zemljista
    maxNapredak : {
        type: Number
    },
    komentari: {
        type: Array
    },
    cena: {
        type: Number
    },
    naStanju: {
        type: Boolean
    }




}
    ,

    {
        collection: 'preduzece_proizvodi'
    })

module.exports = mongoose.model('Preduzece_Proizvodi', Preduzece_proizvodi);