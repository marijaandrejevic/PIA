import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators'
import { Proizvod } from './DataModels/Proizvod';


@Injectable({
  providedIn: 'root'
})
export class MyserviceService {
  uri: string = "http://localhost:4000/api";
  uri_captcha: string = "http://localhost:4000";
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) { }



  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

  regPolj(data): Observable<any> {
    let url = `${this.uri}/registracijaPolj`;
    return this.http.post(url, data, { headers: this.headers })
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  regPred(data): Observable<any> {
    let url = `${this.uri}/registracijaPred`;
    return this.http.post(url, data, { headers: this.headers })
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  login(data): Observable<any> {
    let url = `${this.uri}/login`;
    return this.http.post(url, data, { headers: this.headers })
      .pipe(
        catchError(this.errorMgmt)
      )
  }


  sendToken(token) {
    let url = `${this.uri}/token_validate`;
    return this.http.post<any>(url, { recaptcha: token })
  }

  dohvatiSve() {
    let url = `${this.uri}/dohvatiSve`;
    return this.http.get(url);
  }

  odobri(data) {

    let url = `${this.uri}/prihvati`;
    return this.http.post(url, data, { headers: this.headers })
      .pipe(
        catchError(this.errorMgmt)
      )

  };

  odbij(data) {

    let url = `${this.uri}/odbij`;
    return this.http.post(url, data, { headers: this.headers })
      .pipe(

        catchError(this.errorMgmt)
      )
  };


  izbrisi(data) {

    let url = `${this.uri}/obrisi`;
    return this.http.post(url, data, { headers: this.headers })
      .pipe(
        catchError(this.errorMgmt)
      )
  }


  promeniLozinku(data) {
    let url = `${this.uri}/promeniLozinku`;
    return this.http.post(url, data, { headers: this.headers })
      .pipe(
        catchError(this.errorMgmt)
      )
  }




  izmeni(funkc, data) {
    let url = `${this.uri}/setujNovePodatke`;
    var res = this.http.post<any>(url, { f: funkc, data: data }, { headers: this.headers });

    return res;


  }


  dohvatiSveRasadnike(data): Observable<any> {
    //let url = `${this.uri}/dohvatiSveRas`;
    console.log("USAO U DOHVATI SVE RASADNIKEEEE");
    let url = `${this.uri}/sviRasadnici/${data}`;
    //var res = this.http.post<any>(url, { ime: data }, { headers: this.headers });
    var res = this.http.get<any>(url);

    console.log(res);
    return res;
  }

  temperaturaPromena(naziv, poljoprivrednik, novatemperatura) {
    let url = `${this.uri}/TempPromena`;
    var res = this.http.post<any>(url, { naziv: naziv, poljoprivrednik: poljoprivrednik, novatemperatura: novatemperatura }, { headers: this.headers });

    console.log(res);
    return res;
  }


  kolicinavodePromena(naziv, poljoprivrednik, novakolicinaVode) {
    let url = `${this.uri}/VodaPromena`;
    var res = this.http.post<any>(url, { naziv: naziv, poljoprivrednik: poljoprivrednik, novakolicinaVode: novakolicinaVode });

    console.log(res);
    return res;
  }


  dohvatiPreparate(imeRasadnika) {
    let url = `${this.uri}/DohvatiPreparate`;
    var res = this.http.post<any>(url, { imeRasadnika: imeRasadnika }, { headers: this.headers });
    return res.pipe(

      catchError(this.errorMgmt)
    )
  }

  dohvatiSadnice(imeRasadnika) {
    let url = `${this.uri}/DohvatiSadnice`;
    var res = this.http.post<any>(url, { imeRasadnika: imeRasadnika }, { headers: this.headers });
    return res.pipe(

      catchError(this.errorMgmt)
    )
  }

  smanjiKolProizvodaURasadniku(imeRasadnika, nazivPro, proizvodjac) {
    let url = `${this.uri}/SmanjiKolProizvodaUMagacinu`;
    var res = this.http.post<any>(url, { rasadnikNaziv: imeRasadnika, naziv: nazivPro, proizvodjac: proizvodjac }, { headers: this.headers });
    return res.pipe(
      catchError(this.errorMgmt)
    )
  }

  //dohvati sve iz Magacina i Narucene i Trenutno u Magacinu pristigle
  ucitajProizvodeIzMagacina(nazivRasadnika) {
    let url = `${this.uri}/DohvatiProizvodeINarucene`;
    var res = this.http.post<any>(url, { imeRasadnika: nazivRasadnika }, { headers: this.headers });
    return res.pipe(
      catchError(this.errorMgmt)
    )
  }

  povecajNapredak(imeRasadnika, poljoprivrednik, napredak, pozicija) {
    let url = `${this.uri}/DodajNapredak`;
    var res = this.http.post<any>(url, { naziv: imeRasadnika, poljoprivrednik: poljoprivrednik, napredak: napredak, pozicija: pozicija }, { headers: this.headers });
    return res.pipe(
      catchError(this.errorMgmt)
    )
  }

  dodajRasUBazu(data): Observable<any> {
    let url = `${this.uri}/dodajRasadnik`;
    return this.http.post(url, data, { headers: this.headers })
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  dodajMagacin(data): Observable<any> {
    let url = `${this.uri}/MagacinDodaj`;
    return this.http.post(url, data)
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  dodajSadnicu(data): Observable<any> {
    let url = `${this.uri}/SadnicaDodaj`;
    return this.http.post(url, data)
      .pipe(
        catchError(this.errorMgmt)
      )
  }


  ukloniSadnicu(data): Observable<any> {
    console.log(data.naziv);

    let url = `${this.uri}/SadnicaUkloni`;
    return this.http.post(url, { naziv: data.naziv, poljoprivrednik: data.poljoprivrednik, pozicija: data.pozicija, nazivSad: "", proizvodjac: "" })
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  //proizvodjac-preduzece
  dodajProizvod(data): Observable<any> {
    let url = `${this.uri}/dodajProizvodProizvodjaca`;
    return this.http.post(url, { naziv: data.naziv, proizvodjac: data.proizvodjac, kolicina: data.kolicina, cena: data.cena, tip: data.tip, napredak: data.napredak }, { headers: this.headers })
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  ukloniProizvod(naziv, proizvodjac): Observable<any> {
    let url = `${this.uri}/ukloniProizvodProizvodjaca`;
    return this.http.post(url, { naziv: naziv, proizvodjac: proizvodjac }, { headers: this.headers })
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  izvuciSveProizvodezaPreduzece(preduzece): Observable<any> {
    let url = `${this.uri}/dohvatiProizvodeZaProizvodjaca`;
    return this.http.post(url, { proizvodjac: preduzece }, { headers: this.headers })
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  izvuciSveProizvodeSvihPreduzeca(): Observable<any> {
    let url = `${this.uri}/DohvatiSveProizvodeProizvodjaca`;
    return this.http.post(url, { headers: this.headers })
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  dodajNarudzbinu(data): Observable<any> {
    let url = `${this.uri}/dodajNarudzbinu`;
    return this.http.post(url, { narudzbina: data }, { headers: this.headers })
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  uzmiMojeNarudzbine(data, rasadnik): Observable<any> {
    let url = `${this.uri}/dohvatiNarudzbine`;
    return this.http.post(url, { korisnik: data, rasadnik: rasadnik })
      .pipe(
        catchError(this.errorMgmt)
      )
  }


  otkaziPoruzbinu(data): Observable<any> {
    let url = `${this.uri}/otkaziNarudzbinu`;
    return this.http.post(url, { idNar: data })
      .pipe(
        catchError(this.errorMgmt)
      )
  }


  dohvatiSveNarudzbine(data): Observable<any> {
    let url = `${this.uri}/dohvatiSveNarudzbine`;
    return this.http.post(url, { preduzece: data })
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  //promeni status narudzbine
  promeniStatus(id, status): Observable<any> {
    let url = `${this.uri}/azurirajStatus`;
    return this.http.post(url, { idNar: id, status: status }, { headers: this.headers })
      .pipe(
        catchError(this.errorMgmt)
      )
  }


  //prihvatiNarudzbinu
  prihvatiNarudzbinu(idNar, preduzece) {
    let url = `${this.uri}/prihvatiNarudzbinu`;
    return this.http.post(url, { idNar: idNar, preduzece: preduzece }, { headers: this.headers })
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  //zavrsiNarudzbinu
  zavrsiNarudzbinu(idNar, preduzece) {
    let url = `${this.uri}/zavrsiNarudzbinu`;
    return this.http.post(url, { idNar: idNar, preduzece: preduzece }, { headers: this.headers })
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  //po preduzecu po danima
  brojPoDanima(preduzece) {
    let url = `${this.uri}/brojNarudzbinaPoDanima`;
    return this.http.post(url, { preduzece: preduzece }, { headers: this.headers })
      .pipe(
        catchError(this.errorMgmt)
      )
  }


  //sacuvaj poslatu subskripciju
  mainsubscribe(sub) {
    console.log(sub.toJSON());
    let sub1 = sub.toJSON();
    console.log("MAIN SUBSCRIBE");
    let endpoint = sub1.endpoint;
    console.log(endpoint);
    let expirationTime = sub1.expirationTime;
    console.log(expirationTime);
    let keys = sub1.keys;
    console.log(keys);
    let url = `${this.uri}/sacuvajSub`;
    return this.http.post(url, { endpoint: endpoint, expirationTime: expirationTime, keys: keys}, { headers: this.headers })
      .pipe(
        catchError(this.errorMgmt)
      )
  }


}


