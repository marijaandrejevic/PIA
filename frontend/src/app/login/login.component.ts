import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from "@angular/forms";
import { Router } from '@angular/router';
import { CustomValidator } from '../custom-validator';
import { MyserviceService } from '../myservice.service';
import { User_Poljoprivrednik, User_Preduzece } from '../DataModels/User';
import { SwPush } from '@angular/service-worker';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  submitted = false;
  regPoljForm: FormGroup;
  message:string;
  lozinke_poklapanje:string = '';
  pwdPattern = "^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{6,12}$";
  constructor(private swPush: SwPush, public fb:FormBuilder,private router:Router, private myservice:MyserviceService,private customValidator:CustomValidator) { }
 
  ngOnInit(): void {
    this.mainForm();
  }

  mainForm() {
    this.regPoljForm = this.fb.group({
    korime:['', [Validators.required]],
    lozinka:['', Validators.compose([Validators.required, this.customValidator.patternValidator()])],
  


    });
    
  }

  

  get myForm() {
    return this.regPoljForm.controls;
  }

  onSubmit() {
    this.message = "";
    this.submitted = true;

    /*this.swPush.unsubscribe().then(()=> {
      console.log("Unsubscribed");
    }).catch(e=> {
      console.error(e);
    })*/
    if(!this.regPoljForm.valid) {
      this.message = "Nije validna forma";
      return false;
    }
    else {
      this.myservice.login(this.regPoljForm.value).subscribe(
        (res) => {
          if(res) {
            console.log(res);
            if(res.odobreno == false) {
              this.message = "Nije jos odobren zahtev pokusajte ponovo";

            }
            else {
              if(res.administrator) {
                localStorage.setItem('ulogovan', JSON.stringify(res.korisnickoIme));
                this.router.navigate(['/administrator']);
              }
              else {
                this.message = "Uspesan login";
                if(res.korisnickoIme) {
                  localStorage.setItem('ulogovan', res.korisnickoIme);
                  this.router.navigate(['/poljoprivrednik']);
                }
                else if(res.jedinstveniNaziv) {
                  localStorage.setItem('ulogovan', res.jedinstveniNaziv);
                  this.router.navigate(['/preduzece']);
                }
              }
            }
          }
          else {
            this.message = "Greska u zahtevu!Pokusajte ponovo!!!";
          }

        }, (error) => {
          console.log(error)
        }
      );
    }
  }

}