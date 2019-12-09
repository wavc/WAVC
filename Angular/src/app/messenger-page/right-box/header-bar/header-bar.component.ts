import { Component, OnInit } from '@angular/core';
import { currentConversation } from 'src/app/services/global-data.service';

@Component({
  selector: 'app-header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.css']
})
export class HeaderBarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  StartAudio() {
    let wnd = window.open("/call/" + currentConversation.value, "", "modal=yes,width=650,height=600");
  }
}
