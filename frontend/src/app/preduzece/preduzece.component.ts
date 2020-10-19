import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MyserviceService } from '../myservice.service';
import { Proizvod } from '../DataModels/Proizvod';

@Component({
  selector: 'app-preduzece',
  templateUrl: './preduzece.component.html',
  styleUrls: ['./preduzece.component.css']
})
export class PreduzeceComponent implements OnInit {
  preduzece: String; //ko je ulogovan
  OsnovneInfoGroup: FormGroup;
  dodatneInfoGroup: FormGroup;
  message: String;
  osnovneInfoVisible = true;
  dodatneInfoVisible = false;
  niz: Array<Proizvod> = new Array<Proizvod>();
  nizNarucenih: Array<Object> = new Array<Object>();

  nizNeisporucenih: Array<any> = new Array<any>();

  submittedOsnovno = false;
  submittedDodatno = false;

  //kurir
  slobodniKuriri: number;
 
  //statistika po danima
  statistika = false;
  nizBrojki: Array<any> = new Array<any>();

  //ngModel za suspenziju
  proizvod: String;
  proizvodjac: String;
  constructor(private _formBuilder: FormBuilder, private myservice: MyserviceService) {

  }

  ngOnInit(): void {
    this.osnovneInfoVisible = true;
   

    this.preduzece = localStorage.getItem("ulogovan");
    
    this.initForms();
    this.izvuciSveProizvodeZaPreduzece();
    this.izvuciSveNaruceneZaPreduzece(this.preduzece);
    //this.izvuciSlobodneKurire(this.preduzece);

    console.log(this.preduzece);
    console.log("Broj: " + this.slobodniKuriri);
  }
  initForms() {
    this.OsnovneInfoGroup = this._formBuilder.group({
      naziv: ['', Validators.required],
      proizvodjac: [this.preduzece, Validators.required],
      tip: ['', Validators.required]
    });
    this.dodatneInfoGroup = this._formBuilder.group({
      kolicina: ['', Validators.required],
      cena: ['', Validators.required],
      napredak: ['', Validators.required]
    })
  }
  get OsnovneInfo() {
    return this.OsnovneInfoGroup.controls;
  }

  get DodatneInfo() {
    return this.dodatneInfoGroup.controls;
  }

  next() {
    this.submittedOsnovno = true;
    if (!this.OsnovneInfoGroup.valid) {
      this.message = "Nije validna forma";
      console.log("Poruka: " + this.message);
      return false;
    }
    this.osnovneInfoVisible = false;
    this.dodatneInfoVisible = true;
  }

  finish() {
    this.submittedDodatno = true;
    if (!this.dodatneInfoGroup.valid) {
      this.message = "Nije validna forma";
      console.log("Poruka: " + this.message);
      return false;
    }
    this.dodatneInfoVisible = false;
    console.log(this.OsnovneInfoGroup.value);
    console.log(this.dodatneInfoGroup.value);
    var podaciOProizvodu = {
      naziv: this.OsnovneInfoGroup.value.naziv,
      proizvodjac: this.OsnovneInfoGroup.value.proizvodjac,
      tip: this.OsnovneInfoGroup.value.tip,
      kolicina: this.dodatneInfoGroup.value.kolicina,
      cena: this.dodatneInfoGroup.value.cena,
      napredak: this.dodatneInfoGroup.value.napredak
    }
    console.log(podaciOProizvodu);
    this.myservice.dodajProizvod(podaciOProizvodu).subscribe(
      (res: any) => {
        console.log(res);
        this.izvuciSveProizvodeZaPreduzece();
      },
      (err) => {
        console.log('Error: ' + err);
      }
    )
    this.initForms();
    this.submittedOsnovno = false;
    this.submittedDodatno = false;
    this.osnovneInfoVisible = true;


  }

  obrisi() {
    console.log("Usao u brisanje");
    if (this.proizvod == "" || this.proizvod == null) {
      console.log("Unesi parametre");
      return;
    }
    this.myservice.ukloniProizvod(this.proizvod, this.preduzece).subscribe(

      (res: any) => {
        if (res['nModified'] == 0) console.log("Nije obrisao");
        else {
          console.log("Uspesno brisanje");
          this.izvuciSveProizvodeZaPreduzece();
        }
      },
      (err) => {
        console.log('Error: ' + err);
      }
    );

    this.proizvod = "";
  }


  izvuciSveProizvodeZaPreduzece() {
    this.myservice.izvuciSveProizvodezaPreduzece(this.preduzece).subscribe(
      (res: any) => {
        console.log(res);
        this.niz = res[0];
        console.log(this.niz);
      },
      (err) => {
        console.log('Error: ' + err);
      }
    )
  }

  izvuciSveNaruceneZaPreduzece(preduzece) {
    this.myservice.dohvatiSveNarudzbine(preduzece).subscribe(
      (res: any) => {
        console.log(res);
        this.nizNarucenih = res;
        console.log(this.nizNarucenih) //to je niz narudzbina svih 
      },
      (err) => {
        console.log('Error: ' + err);
      }
    )
  }

  /*izvuciSlobodneKurire(preduzece) {
    this.myservice.izvuciBrKurira(preduzece).subscribe(
      (res) => {
        if (res) {
          console.log("Vratilo mi: " + res);
          this.slobodniKuriri = res;
          

        }
       

      }
    )
  }*/



  prihvati(narudzbina) {

    console.log(narudzbina);
    this.myservice.prihvatiNarudzbinu(narudzbina._id, this.preduzece).subscribe(
      (res)=> {
        console.log(res);
        this.izvuciSveNaruceneZaPreduzece(this.preduzece);
        
      }
    )


    
  }

  odbij(narudzbina) {
    console.log(narudzbina);
    this.myservice.otkaziPoruzbinu(narudzbina._id).subscribe(
      (res) => {
        console.log(res);
        this.izvuciSveNaruceneZaPreduzece(this.preduzece);
      }
    )
  }


  zavrsi(narudzbina) {
    console.log(narudzbina);
    this.myservice.zavrsiNarudzbinu(narudzbina._id, this.preduzece).subscribe(
      (res)=> {
        console.log(res);
        this.izvuciSveNaruceneZaPreduzece(this.preduzece);
      }
    )
  }


  brojPoDanima() {
    console.log(this.preduzece);
    
    this.myservice.brojPoDanima(this.preduzece).subscribe(
      (res)=> {
        console.log(res);
        let niz = res;
        console.log(niz);
        


      }
    )
  }


}
