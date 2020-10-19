import { Component, OnInit } from '@angular/core';
import { MyserviceService } from '../myservice.service';
import { Router, RouterLink } from '@angular/router';
import { User, User_Poljoprivrednik, User_Preduzece } from '../DataModels/User';
import { Zahtev, TipKorisnika } from '../DataModels/Zahtev';

@Component({
  selector: 'app-administrator',
  templateUrl: './administrator.component.html',
  styleUrls: ['./administrator.component.css']
})
export class AdministratorComponent implements OnInit {
  ispis: Array<Zahtev> = new Array();
  message:String;
  constructor(private myservice:MyserviceService, private router:Router) { 
    this.ispis = [];
    this.dohvatiSve();
  }

  ngOnInit(): void {
    
    this.message = "";

  }
  
  dohvatiSve() {
    
    this.myservice.dohvatiSve().subscribe(
      (res:any) => {
        let poljoprivrednici: Array<User_Poljoprivrednik> = res[0];
        let preduzeca: Array<User_Preduzece> = res[1];
        
        poljoprivrednici.forEach(polj => {
          if(polj.odobreno == false) {
              let zahtev = new Zahtev();
              
              zahtev.ime = polj.korisnickoIme;
              zahtev.email = polj.emailPosta;
              //zahtev.kontaktTelefon = i.kontaktTelefon;
              zahtev.tip = TipKorisnika.POLJOPRIVREDNIK;
              this.ispis.push(zahtev);
          }
        });

        preduzeca.forEach(pred=> {
          if(pred.odobreno == false) {
            let zahtev = new Zahtev();
            zahtev.ime = pred.jedinstveniNaziv;
            zahtev.email = pred.emailPosta;
            zahtev.tip = TipKorisnika.PREDUZECE;
            this.ispis.push(zahtev);
          }
        })

        
        console.log(this.ispis);
      }, (err)=> {
        console.log(err);
      }
    );
  }

  
  obrisiIzNiza(ime:String) {
    this.ispis.forEach((el, index)=> {
      if(el.ime == ime) this.ispis.splice(index,1);
    })
  }
  
  odobri(zah:Zahtev) {
    this.message = "Zahtev za " + zah.tip + " imena: " + zah.ime + " je prihvacen";
    
    this.myservice.odobri({ime:zah.ime}).subscribe(
      (res)=> {
        if(res) {
          let n = res['nModified'];
          if(n==1) {
            console.log('Prihvatio zahtev');
            this.obrisiIzNiza(zah.ime);
          }
          else {
            console.log('Prihvatanje nije proslo');
          }
        }
        else {
          console.log('Neuspelo prihvatanje zahteva');
        }
      },
      (err)=> {
        console.log(err);
      }
    )
  }

  odbij(zah:Zahtev) {
    this.message = "Zahtev za " + zah.tip + " imena: " + zah.ime + " je odbijen";
    this.obrisiIzNiza(zah.ime);
    this.myservice.odbij({ime:zah.ime}).subscribe(
      (res)=> {
        if(res) {
          let n = res['deletedCount'];
          if (n == 1) {
            console.log('Obrisao zahtev');
            this.obrisiIzNiza(zah.ime);
          }
          else {
            console.log('Nije uspeo da obrise zahtev');
          }
        }
        else {
          console.log('Neuspelo odbijanje zahteva');
        }
      },
      (err)=> {
        console.log(err);
      }
    )
  }


     
  
}
