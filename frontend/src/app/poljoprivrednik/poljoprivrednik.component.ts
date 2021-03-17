import { Component, OnInit } from '@angular/core';
import { Rasadnik } from '../DataModels/Rasadnik';
import { Router } from '@angular/router';
import { MyserviceService } from '../myservice.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {timer, Subscription} from 'rxjs'
import { ThrowStmt } from '@angular/compiler';
import { CounterComponent } from '../timercomponent';
import { SwPush } from '@angular/service-worker';

@Component({
  selector: 'app-poljoprivrednik',
  templateUrl: './poljoprivrednik.component.html',
  styleUrls: ['./poljoprivrednik.component.css']
})
export class PoljoprivrednikComponent implements OnInit {
  rasadnici: Array<Rasadnik>;
  dodaj:boolean = false;
  dodajRasadForm: FormGroup;
  submitted: boolean = false;
  rasadNezeljeneVrednosti: Array<String> = new Array<String>();
  
  //timer
  time: number = 360;
  private tSub: Subscription;
  stop:boolean = false;
  
  private readonly VAPID_PUBLIC_KEY = "BFQITrA9j5v_x9_w0H6UGcW8GdvnfVMb49HK80vf4AXEKeBf6bDBbfQ_BfJCkYqwu0WdoXOUtrLI89gHcM6LOzc"
  public subscription = this.swPush.subscription;
  public isEnabled = this.swPush.isEnabled;
  constructor( private swPush: SwPush, private router:Router, private myservice:MyserviceService, private fb: FormBuilder) {
    
    
    this.dohvatiSveRasadnike();
    
   
   
   }

  ngOnInit(): void {
    this.pushSubscription();
    console.log("Poljoprivrednik subskripcija");
    this.mainForm();
    
    this.time = 50;
    const ti = timer(0, 1000);

    this.tSub = ti.subscribe(t=> {
      if(!this.stop)
      this.time -= 1;

      if(this.time == 0) {
        this.stop = true;
        this.promeniVrednosti();
      }
    });
    
   
  }
  promeniVrednosti() {
    this.rasadnici.forEach(rasad => {
      
      this.myservice.temperaturaPromena(rasad.naziv, rasad.poljoprivrednik,rasad.trenutnaTemperatura - 0.5).subscribe(
        (res:any)=> {
          console.log(res);
          if(res['nModified'] == 1) {
            console.log("Uspesna promena");
            rasad.trenutnaTemperatura -= 0.5;
          }
        },
        (err)=> {
          console.log('Error: ' + err);
        }
      )

      this.myservice.kolicinavodePromena(rasad.naziv, rasad.poljoprivrednik,rasad.trenutnoVode - 1).subscribe(
        (res:any)=> {
          console.log(res);
          if(res['nModified'] == 1) {
            console.log("Uspesna promena");
            rasad.trenutnoVode -= 1;
          }
        },
        (err)=> {
          console.log('Error: ' + err);
        }
      )
    });
    this.time = 700;
    this.stop = false;
  }

  mainForm(){
    let naziv = localStorage.getItem("ulogovan");
    

    this.dodajRasadForm = this.fb.group({
      naziv:['', [Validators.required]],
      poljoprivrednik: [naziv, [Validators.required]],
      mesto:['', [Validators.required]],
      sirina:['', [Validators.required]],
      duzina:['', [Validators.required]]
    });
  }

  get myForm() {
    return this.dodajRasadForm.controls;
  }

  requestPermission() {
    
  }
  private publicKey = "BO8q7xzIVv7rs8M_S0Q8sduLOzYJAl6lRXI_DCO9cF1khV9iit711kXLmwOgWKWFsdok1vXe8qxdj0MUICAsdX4";
  pushSubscription() {
    if(!this.swPush.isEnabled) {
      console.log("Notification is not enabled");
      return;
    }
    this.swPush.requestSubscription({
      serverPublicKey: this.publicKey,
    }).then(sub=> 
      {
        console.log(sub);
        this.myservice.mainsubscribe(sub).subscribe(res=> {
          console.log(res)
        }, (err)=> {
          console.log(err);
        })
      }).catch(err=>console.log(err))
  }
  dohvatiSveRasadnike(){
    let naziv = localStorage.getItem("ulogovan");
    console.log("Ime: " + naziv);
    console.log("E");
    console.log(this.isEnabled);
    console.log(this.subscription);
    
   

    this.myservice.dohvatiSveRasadnike(naziv).subscribe(
      (res:any) => {
      this.rasadnici = res[0];
      console.log(this.rasadnici);
      this.rasadnici.forEach(rasad => {
        if(rasad.trenutnaTemperatura<12 || rasad.trenutnoVode<75) this.rasadNezeljeneVrednosti.push(rasad.naziv);
      });

      console.log(this.rasadNezeljeneVrednosti);
      },
      (err) => {
        console.log("Error: " + err);
      }
    );  
  }

  prikaz(r:Rasadnik) {
    localStorage.setItem("rasadnikZaPrikaz", JSON.stringify(r));
    this.router.navigate(['/rasadnik']);
  }

  dodajRasadnik() {
    this.dodaj = true;
  }
 
  dodajRasUBazu() {
    this.submitted = true;
    if(this.dodajRasadForm.valid) {
     console.table(this.dodajRasadForm.value);
     this.myservice.dodajRasUBazu(this.dodajRasadForm.value).subscribe(
       (res:any)=> {
         console.log(res);
         console.log(this.dodajRasadForm.value.naziv);
         this.myservice.dodajMagacin({rasadnikNaziv: this.dodajRasadForm.value.naziv}).subscribe(
          (res:any)=> {
            console.log(res);
            this.dodaj = false;
            this.dohvatiSveRasadnike();
            
          }, 
          (err)=> {
            console.log('Error: ' + err);
          }
        )
        
       },
       (error)=> {
         console.log('Error: ' + error);
       }
     );
    
    }
  }
}
