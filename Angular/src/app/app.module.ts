import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistrationPageComponent } from './registration-page/registration-page.component';
import { LogInPageComponent } from './log-in-page/log-in-page.component';
import { MessengerPageComponent } from './messenger-page/messenger-page.component';
import { LeftBoxComponent } from './messenger-page/left-box/left-box.component';
import { NavBarComponent } from './messenger-page/left-box/nav-bar/nav-bar.component';
import { FriendsListComponent } from './messenger-page/left-box/friends-list/friends-list.component';
import { FriendsListElementComponent } from './messenger-page/left-box/friends-list/friends-list-element/friends-list-element.component';
import { RightBoxComponent } from './messenger-page/right-box/right-box.component';
import { HeaderBarComponent } from './messenger-page/right-box/header-bar/header-bar.component';
import { DialogBoxComponent } from './messenger-page/right-box/dialog-box/dialog-box.component';
import { SenderBarComponent } from './messenger-page/right-box/sender-bar/sender-bar.component';
import { MessageRecievedComponent } from './messenger-page/right-box/dialog-box/message-recieved/message-recieved.component';
import { MessageSentComponent } from './messenger-page/right-box/dialog-box/message-sent/message-sent.component';
import { ToastrModule } from 'ngx-toastr';
import { UserService } from './shared/user.service';
import { ProfileService } from './services/profile.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth/auth.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NotificationComponent } from './messenger-page/left-box/nav-bar/notification/notification.component';
import { SearchListElementComponent } from './messenger-page/left-box/friends-list/search-list-element/search-list-element.component';
import { ProfileEditorModalComponent } from './messenger-page/left-box/nav-bar/profile-editor-modal/profile-editor-modal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AudioAndVideoPageComponent } from './audio-and-video-page/audio-and-video-page.component';
// tslint:disable-next-line:max-line-length
import { VideoAndAudioOptionsModalComponent } from './audio-and-video-page/video-and-audio-options-modal/video-and-audio-options-modal.component';
import { SendMessageModalComponent } from './messenger-page/left-box/nav-bar/send-message-modal/send-message-modal.component';
import { Globals } from './shared/globals';
import { ChatService } from './services/chat.service';
import { BodyEvents } from './services/body-events.service';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { VirtualBoardComponent } from './virtual-board/virtual-board.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { Ng5SliderModule } from 'ng5-slider';


@NgModule({
  declarations: [
    AppComponent,
    RegistrationPageComponent,
    LogInPageComponent,
    MessengerPageComponent,
    LeftBoxComponent,
    MessageSentComponent,
    MessageRecievedComponent,
    SenderBarComponent,
    DialogBoxComponent,
    HeaderBarComponent,
    RightBoxComponent,
    FriendsListElementComponent,
    SearchListElementComponent,
    FriendsListComponent,
    NavBarComponent,
    NotificationComponent,
    ProfileEditorModalComponent,
    AudioAndVideoPageComponent,
    VideoAndAudioOptionsModalComponent,
    SendMessageModalComponent,
    VirtualBoardComponent,
  ],
  imports: [
    MatProgressBarModule,
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      progressBar: true
    }),
    HttpClientModule,
    NgbModule,
    ColorPickerModule,
    Ng5SliderModule
  ],
  providers: [
    UserService,
    ProfileService,
    ChatService,
    UserService,
    BodyEvents,
    Globals,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }],
  bootstrap: [AppComponent],
  entryComponents: [ProfileEditorModalComponent]
})
export class AppModule { }
