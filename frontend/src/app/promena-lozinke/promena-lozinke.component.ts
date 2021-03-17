import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomValidator } from '../custom-validator';
import { MyserviceService } from '../myservice.service';

@Component({
  selector: 'app-promena-lozinke',
  templateUrl: './promena-lozinke.component.html',
  styleUrls: ['./promena-lozinke.component.css']
})
export class PromenaLozinkeComponent implements OnInit {
  submitted = false;
  message: String = "";
  lozinke_poklapanje:string = "";
  lozinke_nova_stara_razlika:string = "";
  promenaLozForm: FormGroup;
  ulogovanKor:String;
  constructor(private fb: FormBuilder, private router: Router, private customValidator: CustomValidator, private myService: MyserviceService) { }

  ngOnInit(): void {
    this.ulogovanKor = localStorage.getItem('ulogovan');
    this.mainForm();
  }
  mainForm() {
    this.promenaLozForm = this.fb.group({
      korime: [this.ulogovanKor, ],
      lozinka_stara: ['', Validators.compose([Validators.required, this.customValidator.patternValidator()])],
      loz_nova: ['', Validators.compose([Validators.required, this.customValidator.patternValidator()])],
      loz_nova_potvrda: ['', Validators.compose([Validators.required, this.customValidator.patternValidator()])]
    });
    this.promenaLozForm.get('loz_nova_potvrda').valueChanges.subscribe(val=>{
      let original = this.promenaLozForm.get('loz_nova').value;
      if(val==original) {
        this.lozinke_poklapanje = '';
      }
      else {
        this.lozinke_poklapanje = 'Lozinke se ne poklapaju!';
      }
    });
    this.promenaLozForm.get('loz_nova').valueChanges.subscribe(val=>{
      let stara = this.promenaLozForm.get('lozinka_stara').value;
      if(val==stara) {
        this.lozinke_nova_stara_razlika='Stara i nova sifra ne smeju biti identicne!';
      }
      else  {
        this.lozinke_nova_stara_razlika = '';
      }
    });
  }

  get myForm() {
    return this.promenaLozForm.controls;
  }

  onSubmit() {
    this.message = "";
    this.submitted = true;
    if(!this.promenaLozForm.valid) {
      this.message = "Nije validna forma!";
      return;
    }
    else {
      this.myService.promeniLozinku(this.promenaLozForm.value).subscribe(
        (res)=> {
          if(res) {
            console.log(res);
            if(res['nModified'] == 1) 
            {this.router.navigate(['/login']);}
            else this.message = "Nije uspesna promena lozinke";
          }
          else {
            this.message = "Korisnik sa datim kredencijalima ne postoji";
          }
        }
      )
    }
  }


}
