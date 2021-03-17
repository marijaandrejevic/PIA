export class User {
    _id:string;
    odobreno:boolean;
}

export class User_Poljoprivrednik extends User {
    ime:string;
    prezime:string;
    korisnickoIme:string;
    lozinka:string;
    lozinka_potvrda:string;
    datumRodjenja:Date;
    mestoRodjenja:string;
    kontaktTelefon:string;
    emailPosta:string;
    administrator:boolean;
}


export class User_Preduzece extends User {
    nazivPreduzeca:string;
    jedinstveniNaziv:string;
    lozinka:string;
    lozinka_potvrda:string;
    datumOsnivanja:Date;
    mestoPreduzeca:string;
    emailPosta:string;
}