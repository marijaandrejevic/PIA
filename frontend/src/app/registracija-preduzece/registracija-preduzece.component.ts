import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from "@angular/forms";
import { Router } from '@angular/router';
import { CustomValidator } from '../custom-validator';
import { MyserviceService } from '../myservice.service';
@Component({
  selector: 'app-registracija-preduzece',
  templateUrl: './registracija-preduzece.component.html',
  styleUrls: ['./registracija-preduzece.component.css']
})
export class RegistracijaPreduzeceComponent implements OnInit {
  submitted = false;
  regPoljForm: FormGroup;
  message:string;
  lozinke_poklapanje:string = '';
  SITE_KEY = "6LcDL-kUAAAAAP3xs9JkpOL0h6_j6lo4zTRAFq96";
  recaptcha: any[];
  constructor(public fb:FormBuilder,private router:Router, private customValidator:CustomValidator, private myservice:MyserviceService) { }

  ngOnInit(): void {
    this.mainForm();
  }

  mainForm() {
    this.regPoljForm = this.fb.group({
    nazivPreduzeca:['', [Validators.required]],
    jedinstveniNaziv:['', [Validators.required]],
    lozinka:['', Validators.compose([Validators.required, this.customValidator.patternValidator()])],
    lozinka_potvrda:['', [Validators.required ]],
    datumOsnivanja:[null, [Validators.required]],
    mestoPreduzeca:['', [Validators.required]],
    emailPosta:['', Validators.compose([Validators.required, Validators.email])],
    odobreno:['false'],
    recaptchaReactive:[]
  });

    this.regPoljForm.get('lozinka_potvrda').valueChanges.subscribe(val=>{
      let original = this.regPoljForm.get('lozinka').value;
      if(val==original) {
        this.lozinke_poklapanje = '';
      }
      else {
        this.lozinke_poklapanje = 'Lozinke se ne poklapaju';
      }
    })
  }

  

  get myForm() {
    return this.regPoljForm.controls;
  }

  onSubmit() {
    this.message = "";
    this.submitted = true;
    if(!this.regPoljForm.valid) {
      this.message = "Nije validna forma";
      return false;
    }
    else {
      
      console.table(this.regPoljForm.value);
      this.myservice.regPred(this.regPoljForm.value).subscribe(
        (res) => {
          if(res) {
            console.log(res);
            this.router.navigate(['/login']);
          }
          else {
            this.message = "Vec postoji preduzece sa istim jedinstvenim Nazivom";
          }

        }, (error) => {
          console.log(error)
        }
      );

    }
  }

  async resolved(captchaResponse: any) {
    
    this.recaptcha = captchaResponse;
    console.log(captchaResponse);
    await this.sendTokenToBackend(captchaResponse);
  }

  sendTokenToBackend(tok) {
    this.myservice.sendToken(tok).subscribe(
      data => {
        console.log(data)
      },
      err => {
        console.log(err);
      },
      () => {}
    );
  }

}