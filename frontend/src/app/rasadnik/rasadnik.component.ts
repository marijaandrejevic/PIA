import { Component, OnInit } from '@angular/core';
import { Sadnica } from '../DataModels/Sadnica';
import { MestouRasadniku } from '../DataModels/MestouRasadniku';
import { Rasadnik } from '../DataModels/Rasadnik';
import { MyserviceService } from '../myservice.service';

import { Router } from '@angular/router';
import { timer } from 'rxjs';

@Component({
  selector: 'app-rasadnik',
  templateUrl: './rasadnik.component.html',
  styleUrls: ['./rasadnik.component.css']
})
export class RasadnikComponent implements OnInit {
  sadnice: Array<Sadnica>;
  mesta: Array<MestouRasadniku> = new Array();
  mesta_po_i: Array<Array<MestouRasadniku>> = new Array();
  rasadnik: Rasadnik;
  i: number;
  j: number;
  //flagVadjenjeSpremno: boolean = false;

  //popover;
  popoverIsVisible: Array<boolean>;
  preparatiURasadniku: Array<any> = new Array();
  sadniceURasadniku: Array<any> = new Array();
  preparatiIsVisible: Array<boolean>;
  sadnicaIsVisible: Array<boolean>;
  flagVadjenjeSpremno: Array<boolean>;

  constructor(private service: MyserviceService, private router: Router) { }

  ngOnInit(): void {
    this.formatiraj();
    //const source = timer(1000, 2000);
    //output: 0,1,2,3,4,5......
       // const subscribe = source.subscribe(val => console.log(val));
  }
  formatiraj() {
    this.rasadnik = JSON.parse(localStorage.getItem("rasadnikZaPrikaz"));
    
    console.log(this.rasadnik);
    this.i = 0;
    this.j = 0;
    let sirina = this.rasadnik.sirina;
    let visina = this.rasadnik.duzina;
    this.popoverIsVisible = new Array(sirina * visina).fill(false);
    this.preparatiIsVisible = new Array(sirina * visina).fill(false);
    this.sadnicaIsVisible = new Array(sirina * visina).fill(false);
    this.flagVadjenjeSpremno = new Array(sirina*visina).fill(false);
    this.sadnice = this.rasadnik.sadnice;

    console.log("Sadnice" + this.sadnice);
    for (let p = 0; p < visina; p++) {
      this.mesta_po_i.push(new Array(sirina));

    };

    this.sadnice.forEach(sad => {
      let mesto = new MestouRasadniku();
      let niz_show_popover = new Array();
      mesto.i = this.i;
      mesto.j = this.j;
      if (this.j == (sirina - 1)) {
        this.j = 0;

        this.i++;
      }
      else this.j++;
      console.log("Sadnica");
      console.log(sad);
      mesto.sadnica = sad;
      this.mesta.push(mesto);

      console.log("Mesto");
      console.log(mesto);
      console.log(this.mesta);

      if (this.mesta[this.mesta.length - 1].j == (this.rasadnik.sirina - 1)) {
        this.mesta_po_i[this.mesta[this.mesta.length - 1].i] = this.mesta;
        console.log("Red mesta");
        console.log(this.mesta_po_i[this.mesta[this.mesta.length - 1].i]);
        this.mesta = [];
        niz_show_popover = [];
      }

    });


    let x = 0;
    this.mesta_po_i.forEach(mesta => {
      console.log("Mesta: " + x);
      mesta.forEach(element => {
        console.log(element);
      });
      x++;
      console.log("\n");


    });
    console.log(this.popoverIsVisible);
  }


  prikazati(s: Sadnica) {
    if (s == null) alert('Nema sadnice');
    else alert(s.naziv);

  }


  AzurirajTemp(ras: number) {

    this.service.temperaturaPromena(this.rasadnik.naziv, this.rasadnik.poljoprivrednik, this.rasadnik.trenutnaTemperatura + ras).subscribe(
      (res: any) => {
        if (res['nModified'] == 1) {
          if (ras == 1) {
            this.rasadnik.trenutnaTemperatura = this.rasadnik.trenutnaTemperatura + 1;
          }
          else this.rasadnik.trenutnaTemperatura = this.rasadnik.trenutnaTemperatura - 1;
          localStorage.setItem("rasadnikZaPrikaz", JSON.stringify(this.rasadnik));
          /*this.formatiraj();*/
        }
      },
      (err) => {
        console.log(err);
      }
    )

  }

  AzurirajVodu(ras: number) {
    this.service.kolicinavodePromena(this.rasadnik.naziv, this.rasadnik.poljoprivrednik, this.rasadnik.trenutnoVode + ras).subscribe(
      (res: any) => {
        if (res['nModified'] == 1) {
          if (ras == 1) {
            this.rasadnik.trenutnoVode = this.rasadnik.trenutnoVode + 1;
          }
          else this.rasadnik.trenutnoVode = this.rasadnik.trenutnoVode - 1;
         localStorage.setItem("rasadnikZaPrikaz", JSON.stringify(this.rasadnik));
          /*this.formatiraj();*/
        }
      },
      (err) => {
        console.log(err);
      }
    )
  }

  showPopover(mesto: MestouRasadniku) {
    this.service.dohvatiPreparate(this.rasadnik.naziv).subscribe(
      (res: any) => {
        let niz = res;
        this.preparatiURasadniku = [];
        if (niz != null) {
          niz.forEach(element => {
            if (element.kolicina > 0) this.preparatiURasadniku.push({
              nazivPreparata: element.naziv,
              kolicina: element.kolicina,
              napredak: element.maxNapredak,
              proizvodjac: element.proizvodjac
            })
          })
        };
      },
      (err) => {
        console.log(err);
      }
    );

    this.service.dohvatiSadnice(this.rasadnik.naziv).subscribe(
      (res: any) => {
        let niz = res;
        this.sadniceURasadniku = [];
        if (niz != null) {
          niz.forEach(element => {
            if (element.kolicina > 0) this.sadniceURasadniku.push({
              nazivPreparata: element.naziv,
              kolicina: element.kolicina,
              napredak: element.maxNapredak,
              proizvodjac: element.proizvodjac,
              maxNapredak: element.maxNapredak
            })
          })
        }

      }
    )
    for(let i = 0; i< this.sadniceURasadniku.length; i++) {
      console.log("sadnicaURasadniku: " + this.sadniceURasadniku[i].nazivPreparata + ", a maxNapredak: " + this.sadniceURasadniku[i].maxNapredak);
    }
    this.popoverIsVisible[mesto.i * this.rasadnik.sirina + mesto.j] = true;

  }

  hidePopover(mesto: MestouRasadniku) {
    this.popoverIsVisible[mesto.i * this.rasadnik.sirina + mesto.j] = false;
  }

  skloniPrikazSadnica_nemaih(mesto:MestouRasadniku) {
    this.sadnicaIsVisible[mesto.i*this.rasadnik.sirina + mesto.j] = false;
    this.popoverIsVisible[mesto.i * this.rasadnik.sirina + mesto.j] = false;
  }

  primeni(nazivProizvoda: String, proizvodjac: String, mesto: MestouRasadniku) {
    console.log('Usao u primeni');
    console.log("NazivPrizvoda" + nazivProizvoda);
    console.log("Proizvodjac: " + proizvodjac);
    console.log(mesto);
    this.service.smanjiKolProizvodaURasadniku(this.rasadnik.naziv, nazivProizvoda, proizvodjac).subscribe(
      (res: any) => {
        if (res['nModified'] == 0) console.log('Nije uspeo da update-uje');
        else console.log('Uspesno smanjeno');
      },
      (err) => {
        console.log('Error: ' + err);
      }
    );
    var proizvod = this.preparatiURasadniku.filter(el => el.nazivPreparata == nazivProizvoda);
    console.log(proizvod);

    var p = proizvod[0];
    console.log(p);
    if(this.mesta_po_i[mesto.i][mesto.j].sadnica.napredak >= this.mesta_po_i[mesto.i][mesto.j].sadnica.maxNapredak) {
      console.log("Spremno za vadjenje:D ");
      //setuj flag da je spremno za vadjenje i da ti iskoci popover da mozes izvaditi
      this.flagVadjenjeSpremno[mesto.i*this.rasadnik.sirina + mesto.j] = true;
      return;

    }
    this.service.povecajNapredak(this.rasadnik.naziv, this.rasadnik.poljoprivrednik, (mesto.sadnica.napredak + p.napredak), mesto.i * this.rasadnik.sirina + mesto.j).subscribe(
      (res: any) => {
        if (res['nModified'] == 0) console.log('Nije uspeo da update-uje');
        else console.log('Uspesno povecan napredak');

        localStorage.setItem("rasadnikZaPrikaz", JSON.stringify(this.rasadnik));
        this.mesta_po_i[mesto.i][mesto.j].sadnica.napredak = this.mesta_po_i[mesto.i][mesto.j].sadnica.napredak + p.napredak;
        if(this.mesta_po_i[mesto.i][mesto.j].sadnica.napredak >= this.mesta_po_i[mesto.i][mesto.j].sadnica.maxNapredak) {
          console.log("Spremno za vadjenje:D ");
          //setuj flag da je spremno za vadjenje i da ti iskoci popover da mozes izvaditi
          this.flagVadjenjeSpremno[mesto.i*this.rasadnik.sirina + mesto.j] = true;

        }
        this.preparatiIsVisible[mesto.i * this.rasadnik.sirina + mesto.j] = false;
        this.popoverIsVisible[mesto.i * this.rasadnik.sirina + mesto.j] = false;
      },
      (err) => {
        console.log('Error: ' + err);
      }
    )

  }

  dodajPreparate(mesto: MestouRasadniku) {
    this.preparatiIsVisible[mesto.i * this.rasadnik.sirina + mesto.j] = true;
  }
  dodajSadnicu(mesto: MestouRasadniku) {
    this.sadnicaIsVisible[mesto.i * this.rasadnik.sirina + mesto.j] = true;
  }

  ispisi(mesto: MestouRasadniku) {
    alert("Usao u metodu");
    this.preparatiIsVisible[mesto.i * this.rasadnik.sirina + mesto.j] = false;
  }

  dodaj(el, i: MestouRasadniku) {

    console.log("Info o Rasadniku: " + this.rasadnik.naziv + " : " + this.rasadnik.poljoprivrednik);
    console.log("Info o mestu: " + (i.i * this.rasadnik.sirina + i.j));
    console.log("Info o sadnici: " + el.nazivPreparata + " , " + el.proizvodjac);
    console.log("MaxNapredak sadnice: " + el.maxNapredak);
    let pos = i.i * this.rasadnik.sirina + i.j;
    this.service.dodajSadnicu({ naziv: this.rasadnik.naziv, poljoprivrednik: this.rasadnik.poljoprivrednik, nazivSad: el.nazivPreparata, proizvodjac: el.proizvodjac, pozicija: pos, maxNapredak: el.maxNapredak }).subscribe(
      (res: any) => {
        console.log(res);

        this.mesta_po_i[i.i][i.j].sadnica = { naziv: el.nazivPreparata, proizvodjac: el.proizvodjac, napredak: 0, maxNapredak: el.maxNapredak };
        this.popoverIsVisible[i.i * this.rasadnik.sirina + i.j] = false;
        this.sadnicaIsVisible[i.i * this.rasadnik.sirina + i.j] = false;
        console.log(this.mesta_po_i[i.i][i.j]);
      },
      (err) => {
        console.log('Error: ' + err);
      }
    )


  }


  idiNaMagacin() {
    this.router.navigate(['/magacin']);
  }

  izvadiSadnicu(i:MestouRasadniku) {
    console.log("USAO u izvadiSadnicuuuuu");
    let pos = i.i * this.rasadnik.sirina + i.j;
    this.service.ukloniSadnicu({ naziv: this.rasadnik.naziv, poljoprivrednik: this.rasadnik.poljoprivrednik, nazivSad: "", proizvodjac: "", pozicija: pos}).subscribe(
      (res:any)=> {
        console.log(res);
        this.mesta_po_i[i.i][i.j].sadnica = { naziv: '', proizvodjac: '', napredak: 0, maxNapredak: 0 }
        this.popoverIsVisible[i.i * this.rasadnik.sirina + i.j] = false;
        this.sadnicaIsVisible[i.i * this.rasadnik.sirina + i.j] = false;
        this.flagVadjenjeSpremno[i.i*this.rasadnik.sirina + i.j] = false;
        console.log(this.mesta_po_i[i.i][i.j]);
      },
      (err)=> {
        console.log(err);
      }
    )

  }

}
