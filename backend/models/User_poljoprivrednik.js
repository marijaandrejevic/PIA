const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

let User_polje =  new Schema({
    _id: {
        type:Schema.Types.ObjectId,
        auto:true
    },
    ime: {
        type:String,
        required: 'Ime ne moze biti prazno polje'
    },
    prezime: {
        type:String,
        required: 'Prezime ne moze biti prazno polje'
    },
    korisnickoIme: {
        type:String,
        required: 'Korisnicko ime ne moze biti prazno polje'
    },
    lozinka: {
        type:String,
        required:'Lozinka ne moze biti prazno polje',
        minlength: [8, 'Lozinka mora biti minimalne duzine od 8 karaktera'],
    },
    lozinka_potvrda: {
        type:String,
        required:'Lozinka potvrda ne moze biti prazno polje'
    },
    datumRodjenja: {
        type:Date,
        required: 'Datum rodjenja ne moze biti prazno polje',
    },
    mestoRodjenja: {
        type:String,
        required: 'Mesto rodjenja ne sme biti prazno polje',

    },
    kontaktTelefon: {
        type:String,
        required: 'Kontakt telefon ne sme biti prazno polje'
    },
    emailPosta: {
        type:String,
        required: 'Email adresa ne sme biti prazno polje'
    }, 
    administrator: {
        type:Boolean,
        required: "Mora se definisati da li je administrator ili nije"
    },
    odobreno: {
        type:Boolean,
        required: 'Mora biti definisano da li je registracija odobrena'
    }
},
{
    collection: 'users_poljoprivrednici'
})

module.exports = mongoose.model('KorisniciPolje', User_polje);