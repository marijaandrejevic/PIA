import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './login/login.component';
import { RegistracijaPoljoprivrednikComponent } from './registracija-poljoprivrednik/registracija-poljoprivrednik.component';
import { RegistracijaPreduzeceComponent } from './registracija-preduzece/registracija-preduzece.component';
import { AdministratorComponent } from './administrator/administrator.component';
import { ModifikacijeAdminComponent } from './modifikacije-admin/modifikacije-admin.component';
import { PromenaLozinkeComponent } from './promena-lozinke/promena-lozinke.component';
import { PoljoprivrednikComponent } from './poljoprivrednik/poljoprivrednik.component';
import { PreduzeceComponent } from './preduzece/preduzece.component';
import { RasadnikComponent } from './rasadnik/rasadnik.component';
import { MagacinComponent } from './magacin/magacin.component';



const routes: Routes = [
  {path: '', component:MainComponent},
  {path: 'login', component: LoginComponent},
  {path: 'regPolj', component: RegistracijaPoljoprivrednikComponent},
  {path:'regPred', component:RegistracijaPreduzeceComponent},
  {path: 'administrator', component:AdministratorComponent},
  {path: 'modifikacije/:id', component:ModifikacijeAdminComponent},
  {path: 'promenaLoz', component:PromenaLozinkeComponent},
  {path:'poljoprivrednik', component:PoljoprivrednikComponent},
  {path:'preduzece', component:PreduzeceComponent},
  {path:'rasadnik', component:RasadnikComponent},
  {path: 'magacin', component:MagacinComponent}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
