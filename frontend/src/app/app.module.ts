import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {MyserviceService} from '../app/myservice.service'
import { HttpClientModule} from '@angular/common/http'

import {RecaptchaModule, RecaptchaFormsModule} from 'ng-recaptcha';
import {MatStepperModule} from '@angular/material/stepper';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { RegistracijaPoljoprivrednikComponent } from './registracija-poljoprivrednik/registracija-poljoprivrednik.component';
import { RegistracijaPreduzeceComponent } from './registracija-preduzece/registracija-preduzece.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdministratorComponent } from './administrator/administrator.component';
import { ModifikacijeAdminComponent } from './modifikacije-admin/modifikacije-admin.component';
import { PromenaLozinkeComponent } from './promena-lozinke/promena-lozinke.component';
import { PoljoprivrednikComponent } from './poljoprivrednik/poljoprivrednik.component';
import { PreduzeceComponent } from './preduzece/preduzece.component';
import { RasadnikComponent } from './rasadnik/rasadnik.component';
import { MagacinComponent } from './magacin/magacin.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import {Dexie} from 'dexie'
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    RegistracijaPoljoprivrednikComponent,
    RegistracijaPreduzeceComponent,
    AdministratorComponent,
    ModifikacijeAdminComponent,
    PromenaLozinkeComponent,
    PoljoprivrednikComponent,
    PreduzeceComponent,
    RasadnikComponent,
    MagacinComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('../ngsw-worker.js'),
    
    
    
  
  
  ],
  providers: [MyserviceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
