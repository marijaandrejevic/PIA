import { Komentar } from './Komentar';

export class Proizvod {
    naziv:String;
    proizvodjac:String;
    kolicina:Number;
    naStanju:Boolean;
    prosecnaOcena:DoubleRange;
    komentari: Array<Komentar> = new Array<Komentar>();
    cena:Number;
    maxNapredak:Number;
    tip:String;
}