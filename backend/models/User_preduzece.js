const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

let User_pred =  new Schema({
    _id: {
        type:Schema.Types.ObjectId,
        auto:true
    },
    nazivPreduzeca: {
        type:String,
        required: 'Naziv ne moze biti prazno polje'
    },
   jedinstveniNaziv: {
        type:String,
        required: 'Jedinstveni Naziv ne moze biti prazno polje'
    },
    lozinka: {
        type:String,
        required:'Lozinka ne moze biti prazno polje',
        minlength: [8, 'Lozinka mora biti minimalne duzine od 8 karaktera'],
    },
    lozinka_potvrda: {
        type:String,
        required:'Lozinka ne moze biti prazno polje',
        minlength: [8, 'Lozinka mora biti minimalne duzine od 8 karaktera'],
    },
    datumOsnivanja: {
        type:Date,
        required: 'Datum osnivanja ne moze biti prazno polje',
    },
    mestoPreduzeca: {
        type:String,
        required: 'Mesto preduzeca ne sme biti prazno polje',

    },
    emailPosta: {
        type:String,
        required: 'Email adresa ne sme biti prazno polje'
    }, 
    odobreno: {
        type:Boolean,
        required: 'Mora biti definisano da li je registracija odobrena'
    },
    brKurira: {
        type: Number
    }
    
},
{
    collection: 'users_preduzeca'
})

module.exports = mongoose.model('KorisniciPred', User_pred);