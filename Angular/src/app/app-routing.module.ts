import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegistrationPageComponent } from './registration-page/registration-page.component';
import { LogInPageComponent } from './log-in-page/log-in-page.component';
import { MessengerPageComponent } from './messenger-page/messenger-page.component';

const routes: Routes = [
  {path:'', redirectTo:'sign-in', pathMatch: 'full'},
  {path:'registration', component: RegistrationPageComponent},
  {path:'sign-in', component: LogInPageComponent},
  {path:'messenger', component: MessengerPageComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
