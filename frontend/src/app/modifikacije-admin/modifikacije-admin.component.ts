import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MyserviceService } from '../myservice.service';
import { AstMemoryEfficientTransformer } from '@angular/compiler';
import { CustomValidator } from '../custom-validator';
import { TipKorisnika } from '../DataModels/Zahtev';

@Component({
  selector: 'app-modifikacije-admin',
  templateUrl: './modifikacije-admin.component.html',
  styleUrls: ['./modifikacije-admin.component.css']
})
export class ModifikacijeAdminComponent implements OnInit {
  id: number;
  submitted: boolean = false;

  //modifikacijaForm
  modForm: FormGroup;
  //funkcionalnosti: any[] = [];

  //obrisiForm
  obrisiForm: FormGroup;

  //dodajPoljoprivrednika
  regPoljForm: FormGroup;

  lozinke_poklapanje: string; //i za dodajPoljoprivrednika i za dodajPreduzece

  //dodajPreduzece
  regPredForm: FormGroup;

  message: string;
  constructor(private route: ActivatedRoute, public fb: FormBuilder, private router: Router, private service: MyserviceService, private customValidator: CustomValidator) { }

  ngOnInit(): void {
    this.id = parseInt(this.route.snapshot.paramMap.get('id'));
    this.message = "ID: " + this.id;
    this.mainForm(this.id);
  }

  mainForm(id: number): void {
    if (id == 1) {
      this.modForm = this.fb.group({
        ime: ['', Validators.required],
        funkcionalnosti: [[], Validators.required],
        novaSifra: ['', this.customValidator.patternValidator()],
        noviMejl: ['', Validators.email],

      })
    }
    else if (id == 2) {
      this.obrisiForm = this.fb.group({
        ime: ['', Validators.required]
      });
    }
    else if (id == 3) {
      this.regPoljForm = this.fb.group({
        ime: ['', [Validators.required]],
        prezime: ['', [Validators.required]],
        korisnickoIme: ['', [Validators.required]],
        lozinka: ['', Validators.compose([Validators.required, this.customValidator.patternValidator()])],
        lozinka_potvrda: ['', [Validators.required]],
        datumRodjenja: [null, [Validators.required]],
        mestoRodjenja: ['', [Validators.required]],
        kontaktTelefon: ['', [Validators.required]],
        emailPosta: ['', Validators.compose([Validators.required, Validators.email])],
        odobreno: ['true'],
        administrator: ['false'],


      });
      this.regPoljForm.get('lozinka_potvrda').valueChanges.subscribe(val => {
        let original = this.regPoljForm.get('lozinka').value;
        if (val == original) {
          this.lozinke_poklapanje = '';
        }
        else {
          this.lozinke_poklapanje = 'Lozinke se ne poklapaju';
        }
      })
    }

    else if (id == 4) {
      this.regPredForm = this.fb.group({
        nazivPreduzeca: ['', [Validators.required]],
        jedinstveniNaziv: ['', [Validators.required]],
        lozinka: ['', Validators.compose([Validators.required, this.customValidator.patternValidator()])],
        lozinka_potvrda: ['', [Validators.required]],
        datumOsnivanja: [null, [Validators.required]],
        mestoPreduzeca: ['', [Validators.required]],
        emailPosta: ['', Validators.compose([Validators.required, Validators.email])],
        odobreno: ['true'],

      });

      this.regPredForm.get('lozinka_potvrda').valueChanges.subscribe(val => {
        let original = this.regPredForm.get('lozinka').value;
        if (val == original) {
          this.lozinke_poklapanje = '';
        }
        else {
          this.lozinke_poklapanje = 'Lozinke se ne poklapaju';
        }
      })
    }


  }


  get myFormMod() {
    return this.modForm.controls;
  }
  get myFormObrisi() {
    return this.obrisiForm.controls;
  }

  get myFormPolj() {
    return this.regPoljForm.controls;
  }

  get myFormPred() {
    return this.regPredForm.controls;
  }



  onSubmit(id_zahteva: number) {
    this.message = "";
    this.submitted = true;
    if (id_zahteva == 1) {
      if (!this.modForm.valid) {
        return;
      }
      else {
        console.log(this.modForm.value);
        console.log("Niz: " + this.modForm.controls.funkcionalnosti.value);
        var mojString = "";
        let data = this.modForm.controls.funkcionalnosti.value;
        for (let i = 0; i < data.length; i++) {
          this.service.izmeni(data[i], this.modForm.value).subscribe(
            (res) => {
              if (res) {
                console.log(res);
              }
              else {
                console.log("ERROR");
              }
            },
            (err) => {
              console.log(err);
            }
          );
        }

      }
    }

    else if (id_zahteva == 2) {
      if (!this.obrisiForm.valid) return;
      else {
        console.log(this.obrisiForm.value);
        this.service.izbrisi(this.obrisiForm.value).subscribe(
          (res) => {
            console.log(res);
          },
          (err) => {
            console.log(err);
          }
        )

      }
    }

    else if (id_zahteva == 3) {
      if (!this.regPoljForm.valid) return;
      else {
        console.log(this.regPoljForm.value);
        this.service.regPolj(this.regPoljForm.value).subscribe(
          (res) => {
            if(res) {
              console.log(res);
            }
            else {
              console.log("Korisnik sa istim korisnickim imenom vec postoji");
            }
  
          }, (error) => {
            console.log(error)
          }
        );
  
      }
    }

    else if (id_zahteva == 4) {
      if (!this.regPredForm.valid) return;
      else {
        console.log(this.regPredForm.value);
        this.service.regPred(this.regPredForm.value).subscribe(
          (res) => {
            if (res) {
              console.log(res);
            }
            else {
              console.log("Vec postoji preduzece sa istim jedinstvenim Nazivom");
            }

          }, (error) => {
            console.log(error)
          }
        );
      }
    }

    this.router.navigate(['/administrator']);

  }



  odabrana(fun: string): boolean {
    // console.log(funkcionalnosti);
    //console.log(fun);
    let niz = this.modForm.controls.funkcionalnosti.value;
    for (let i = 0; i < niz.length; i++) {
      if (niz[i] == fun) {
        // console.log("Uspeo");
        return true;
      }
    }
    // console.log("Nije uspeo");
    return false;

  };
}


