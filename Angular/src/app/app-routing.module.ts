import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegistrationPageComponent } from './registration-page/registration-page.component';
import { LogInPageComponent } from './log-in-page/log-in-page.component';
import { MessengerPageComponent } from './messenger-page/messenger-page.component';
import { AuthGuard } from './auth/auth.guard';
import { AudioAndVideoPageComponent } from './audio-and-video-page/audio-and-video-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
  { path: 'registration', component: RegistrationPageComponent },
  { path: 'sign-in', component: LogInPageComponent },
  { path: 'messenger', component: MessengerPageComponent, canActivate: [AuthGuard] },
  { path: 'call/:id',  component: AudioAndVideoPageComponent, canActivate: [AuthGuard] }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
