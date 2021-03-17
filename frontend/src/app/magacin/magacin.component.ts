import { Component, OnInit, Directive, Input, Output, EventEmitter, ViewChildren, QueryList } from '@angular/core';
import { Rasadnik } from '../DataModels/Rasadnik';
import { MyserviceService } from '../myservice.service';
import { Proizvod } from '../DataModels/Proizvod';
import { Narudzbina } from '../DataModels/Narudzbina';

@Component({
  selector: 'app-magacin',
  templateUrl: './magacin.component.html',
  styleUrls: ['./magacin.component.css']
})
export class MagacinComponent implements OnInit {
  rasadnik: Rasadnik;
  ulogovan: String;
  proizvodiIzMagacina: Array<any> = new Array<any>();
  naruceniProizvodi: Array<any> = new Array<any>();
  narudzbine : Array<any> = new Array<any>();

  //za filtriranje
  proizvodifilter: Array<any> = new Array<any>();


  //filter 
  filterKolicina: boolean = false;
  filterNaziv: boolean = false;
  filterProizvodjac: boolean = false;
  kolicina = "";
  naziv = "";
  proizvodjac = "";
  

  //onlineProdavnica
  online: boolean = false;
  proizvodiUPonudi: Array<any> = new Array<any>();

  proizvodiKojeBihDaNarucim: Array<any> = new Array<any>();
  kolicinaProizvoda: Number;
  kol: string;
  setKol = false;
  trenutniProizvod: any;

  filterNazivPro: boolean = false;
  filterTip: boolean = false;
  nazivPro: string;
  tip: string;

  constructor(private myService: MyserviceService) { }

  ngOnInit(): void {
    this.rasadnik = JSON.parse(localStorage.getItem("rasadnikZaPrikaz"));
    this.ulogovan = localStorage.getItem("ulogovan");
    this.ucitajProizvodeIzMagacina(this.rasadnik.naziv);
    this.ucitajNarucene(this.ulogovan);
    console.log(this.naruceniProizvodi);
  }


  ucitajProizvodeIzMagacina(naziv) {
    this.myService.ucitajProizvodeIzMagacina(naziv).subscribe(
      (res) => {
        if (res) {
          this.proizvodiIzMagacina = res[0];
          console.log("U magacinu trenutno: " + this.proizvodiIzMagacina);
          //this.naruceniProizvodi = res[1];
          //console.log("Naruceni iz magacina: " + this.naruceniProizvodi);
        }
      }
    );
  }


  ucitajProizvodeSvihProizvodjaca() {
    this.myService.izvuciSveProizvodeSvihPreduzeca().subscribe(
      (res) => {
        if (res) {
          this.proizvodiUPonudi = res[0];
          console.log(res);

        }
      }
    )
  }


  ucitajNarucene(ulogovan) {
    this.naruceniProizvodi = [];
    this.myService.uzmiMojeNarudzbine(ulogovan, this.rasadnik.naziv).subscribe(
      (res) => {
        if (res) {
          this.narudzbine = res;
          this.narudzbine.forEach(element => {
            console.log(element)
            if (element.status == "NIJE ISPORUCENA" || element.status == "NA CEKANJU" || element.status == "ISPORUKA U TOKU") {
              element.proizvodi.forEach(pro => {
                let proizvod = {
                  proFinal: pro,
                  idNar: element._id
                }
                console.log(proizvod);
                this.naruceniProizvodi.push(proizvod);
              });
            }
          });

          console.log(this.naruceniProizvodi);
        }
      }
    )
  }


  setFilterProizvodjac() {
    console.log("USAO FP")
    this.filterKolicina = false;
    this.filterNaziv = false;
    this.filterProizvodjac = true;
  }
  setFilterNaziv() {
    console.log("USAO FN");
    this.filterKolicina = false;
    this.filterNaziv = true;
    this.filterProizvodjac = false;
  }
  setFilterKolicina() {
    console.log("USAO FK");
    this.filterKolicina = true;
    this.filterNaziv = false;
    this.filterProizvodjac = false;
  }

  //za online prodavnicu
  setFilterNazivPro() {
    console.log("USAO FNP");
    this.filterNazivPro = true;
    this.filterTip = false;

  }

  setFilterTip() {
    console.log("USAO FT");
    this.filterNazivPro = false;
    this.filterTip = true;

  }

  filtrirajNaziv() {


    this.proizvodiIzMagacina = this.proizvodiIzMagacina.filter(el => el.naziv.toLowerCase().indexOf(this.naziv.toLocaleLowerCase()) != -1);

    console.log(this.proizvodiIzMagacina);
    this.filterKolicina = false;
    this.filterNaziv = false;
    this.filterProizvodjac = false;
  }

  filtrirajProizvodjac() {

    this.proizvodiIzMagacina = this.proizvodiIzMagacina.filter(el => el.proizvodjac.toLowerCase().indexOf(this.proizvodjac.toLocaleLowerCase()) != -1);

    console.log(this.proizvodiIzMagacina);
    this.filterKolicina = false;
    this.filterNaziv = false;
    this.filterProizvodjac = false;
  }

  filtrirajKolicinu() {
    let kol = parseInt(this.kolicina);
    console.log(kol);
    this.proizvodiIzMagacina = this.proizvodiIzMagacina.filter(el => el.kolicina <= kol); //trazi do max te kolicine
    this.filterKolicina = false;
    this.filterNaziv = false;
    this.filterProizvodjac = false;
  }
  
  filtrirajNazivPro() {
    console.log("USAO");
    console.log(this.nazivPro);
    this.proizvodiUPonudi = this.proizvodiUPonudi.filter(el => el.naziv.toLowerCase().indexOf(this.nazivPro.toLocaleLowerCase()) != -1);
    this.filterNazivPro = false;
    this.filterTip = false;
    
  }

  filtrirajTip() {
    console.log("USAO");
    console.log(this.tip);
    this.proizvodiUPonudi = this.proizvodiUPonudi.filter(el => el.tipProizvoda.toLowerCase().indexOf(this.tip.toLocaleLowerCase()) != -1);
    this.filterNazivPro = false;
    this.filterTip = false;
  }

  ucitajSve() {
    this.ucitajProizvodeIzMagacina(this.rasadnik.naziv);
  }

  ucitajSveUPonudi() {
    this.ucitajProizvodeSvihProizvodjaca();
  }

  sortNazivA() {
    this.proizvodiIzMagacina = this.proizvodiIzMagacina.sort((pro1, pro2) => {
      if (pro1.naziv > pro2.naziv) { return 1; }
      if (pro1.naziv < pro2.naziv) { return -1; }
      return 0;
    });
  }

  sortNazivD() {
    this.proizvodiIzMagacina = this.proizvodiIzMagacina.sort((pro1, pro2) => {
      if (pro1.naziv > pro2.naziv) { return -1; }
      if (pro1.naziv < pro2.naziv) { return 1; }
      return 0;
    });
  }

  sortProizvodjacA() {
    this.proizvodiIzMagacina = this.proizvodiIzMagacina.sort((pro1, pro2) => {
      if (pro1.proizvodjac > pro2.proizvodjac) { return 1; }
      if (pro1.proizvodjac < pro2.proizvodjac) { return -1; }
      return 0;
    });
  }

  sortProizvodjacD() {
    this.proizvodiIzMagacina = this.proizvodiIzMagacina.sort((pro1, pro2) => {
      if (pro1.proizvodjac > pro2.proizvodjac) { return -1; }
      if (pro1.proizvodjac < pro2.proizvodjac) { return 1; }
      return 0;
    });
  }


  sortKolicinaA() {
    this.proizvodiIzMagacina = this.proizvodiIzMagacina.sort((pro1, pro2) => {
      return pro1.kolicina - pro2.kolicina;
    });
  }

  sortKolicinaD() {
    this.proizvodiIzMagacina = this.proizvodiIzMagacina.sort((pro1, pro2) => {
      return pro2.kolicina - pro1.kolicina;
    });
  }

  setOnlineTrue() {
    this.online = true;
    this.ucitajProizvodeSvihProizvodjaca();
    this.proizvodiKojeBihDaNarucim = [];
  }

  otkaziPorudzbinu(proizvod: any) {
    console.log("USAO");
    console.log(proizvod);
    if(proizvod.proFinal.status == "U TOKU") {
      console.log("Ne mozes da otkazes u toku je, preuzeo je kurir"); 
      return;
    }
     this.myService.otkaziPoruzbinu(proizvod.idNar).subscribe(
       (res)=> {
        console.log(res);
       }
     )
   this.ucitajNarucene(this.ulogovan);
  }

  naruci() {
    //ako hocu vise proizvoda da stavim mogu da stavim u ovo naruci u neki niz a onda dodam dugme zavrsi kupovinu koja radi sa serverom
    console.log("NARUCUJE");
    let pro = {
      naziv: this.trenutniProizvod.naziv,
      tip: this.trenutniProizvod.tipProizvoda,
      proizvodjac: this.trenutniProizvod.proizvodjac,
      kolicina: parseInt(this.kol)

    }
    this.proizvodiKojeBihDaNarucim.push(pro);
    this.kol = "";
    this.setKol = false;

    console.log(this.proizvodiKojeBihDaNarucim);
  }


  zavrsiKupovinu() {
    console.log(this.proizvodiKojeBihDaNarucim);
    //podrazumevano moze vise od proizvoda istog proizvodjaca u 1 narudzbi da bi bilo lakse vadjenje kad moras pregled svih
    let narudzbina = new Narudzbina();
    narudzbina.proizvodi = this.proizvodiKojeBihDaNarucim;
    narudzbina.preduzece = this.proizvodiKojeBihDaNarucim[0].proizvodjac;
    narudzbina.poljoprivrednik = this.ulogovan;
    narudzbina.datumNarudzbine = new Date();
    narudzbina.status = "NIJE ISPORUCENA";
    narudzbina.rasadnik = this.rasadnik.naziv;

    console.log(narudzbina);

    //dodaj narudzbinu
    this.myService.dodajNarudzbinu(narudzbina).subscribe(
      (res) => {
        console.log(res);
      }
    )

    this.ucitajNarucene(this.ulogovan);

    this.online = false;
  }

  setKolTrue(pro: any) {
    this.trenutniProizvod = pro;
    console.log(this.trenutniProizvod);
    this.setKol = true;
  }

  
}




