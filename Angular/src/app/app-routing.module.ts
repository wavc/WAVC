import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegistrationPageComponent } from './registration-page/registration-page.component';
import { LogInPageComponent } from './log-in-page/log-in-page.component';
import { MessengerPageComponent } from './messenger-page/messenger-page.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {path: '', component: MessengerPageComponent, canActivate: [AuthGuard]},
  {path: 'registration', component: RegistrationPageComponent},
  {path: 'sign-in', component: LogInPageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
