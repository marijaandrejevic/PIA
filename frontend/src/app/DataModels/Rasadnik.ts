import { Sadnica } from './Sadnica';

export class Rasadnik {
    poljoprivrednik:String;
    naziv:String;
    mesto:String;
    brojZasadjenih:number;
    brojSlobodnihMesta:number;
    trenutnoVode:number;
    trenutnaTemperatura:number;
    sirina:number;
    duzina:number;
    raspored:Array<number> = new Array(this.sirina*this.duzina);
    sadnice: Array<Sadnica> = new Array(this.sirina*this.duzina);
}