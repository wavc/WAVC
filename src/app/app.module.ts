import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { LeftBoxComponent } from './left-box/left-box.component';
import { NavBarComponent } from './left-box/nav-bar/nav-bar.component';
import { FriendsListComponent } from './left-box/friends-list/friends-list.component';
import { FriendsListElementComponent } from './left-box/friends-list/friends-list-element/friends-list-element.component';
import { RightBoxComponent } from './right-box/right-box.component';
import { HeaderBarComponent } from './right-box/header-bar/header-bar.component';
import { DialogBoxComponent } from './right-box/dialog-box/dialog-box.component';
import { SenderBarComponent } from './right-box/sender-bar/sender-bar.component';
import { MessageRecievedComponent } from './right-box/dialog-box/message-recieved/message-recieved.component';
import { MessageSentComponent } from './right-box/dialog-box/message-sent/message-sent.component';

@NgModule({
  declarations: [
    AppComponent,
    LeftBoxComponent,
    NavBarComponent,
    FriendsListComponent,
    FriendsListElementComponent,
    RightBoxComponent,
    HeaderBarComponent,
    DialogBoxComponent,
    SenderBarComponent,
    MessageRecievedComponent,
    MessageSentComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
