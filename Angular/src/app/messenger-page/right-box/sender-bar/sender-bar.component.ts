import { Component, OnInit } from '@angular/core';
import { Globals } from 'src/app/shared/globals';
import { ApiService } from 'src/app/services/api.service';
import { ChatService } from 'src/app/services/chat.service';
import { ConversationModel } from 'src/app/models/conversation.model';
import { BodyEvents } from 'src/app/services/body-events.service';
import { HttpEventType } from '@angular/common/http';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-sender-bar',
  templateUrl: './sender-bar.component.html',
  styleUrls: ['./sender-bar.component.css']
})
export class SenderBarComponent implements OnInit {
  constructor(private chatService: ChatService, private apiService: ApiService, private bodyEvents: BodyEvents) { }

  private conversation: ConversationModel;

  fileArray: { id: number, name: string, size: string, file: File }[] = [];
  overlay: HTMLElement;
  overlayText: HTMLElement;
  fileInfo: HTMLElement;
  filesInput: HTMLInputElement;
  entered = 0;
  progressBar = 0;
  dragenter: (this: HTMLElement, ev: DragEvent) => any;
  dragleave: (this: HTMLElement, ev: DragEvent) => any;
  dragover: (this: HTMLElement, ev: DragEvent) => any;
  drop: (this: HTMLElement, ev: DragEvent) => any;

  ngOnInit() {
    this.chatService.currentConversation
      .subscribe((data) => this.conversation = data);

    this.overlay = document.getElementById('main-overlay');
    this.overlayText = document.getElementById('overlay_text');
    this.fileInfo = document.getElementById('file-info');
    this.filesInput = document.getElementById('files') as HTMLInputElement;
    this.filesInput.addEventListener('change', () => this.ShowFileList());
    this.dragenter = (e) => this.StartedDragging(e);
    this.dragleave = (e) => this.EndedDragging(e);
    this.dragover = (e) => this.PreventOpen(e);
    this.drop = (e) => this.Dropped(e);
    this.bodyEvents.Add('dragenter', this.dragenter);
    this.bodyEvents.Add('dragleave', this.dragleave);
    this.bodyEvents.Add('dragover', this.dragover);
    this.bodyEvents.Add('drop', this.drop);
  }

  ShowFileList() {
    this.fileInfo.classList.remove('hide_element');
    this.fileArray = this.fileArray.concat(this.FileListToArray(this.filesInput.files).map((file, i) => {
      return { id: i, name: file.name, size: this.DisplaySize(file.size), file };
    }));
  }

  DeleteFile(id: number) {
    const indexToDelete = this.fileArray.findIndex(f => f.id === id);
    this.fileArray.splice(indexToDelete, 1);
  }


  sendMessage(messageInput: any) {

    const messageText = messageInput.value.trim();

    if (this.filesInput.files.length > 0) {
      this.SaveFiles();
    }
    if (messageText === '') {
      return;
    }

    this.apiService.sendTextMessage(this.conversation.conversationId, messageText)
      .subscribe();
    messageInput.value = '';

  }

  StartedDragging(e: DragEvent) {
    this.entered++;
    if (this.entered === 1) {
      this.overlay.classList.add('drag_entered');
      this.overlayText.classList.remove('hide_element');
    }
  }
  PreventOpen(e: DragEvent) {
    e.preventDefault();
  }
  EndedDragging(e: DragEvent) {
    this.entered--;
    if (this.entered === 0) {
      this.overlay.classList.remove('drag_entered');
      this.overlayText.classList.add('hide_element');
    }
  }
  Dropped(e: DragEvent) {
    this.PreventOpen(e);
    this.EndedDragging(e);

    this.filesInput.files = e.dataTransfer.files;
    this.filesInput.dispatchEvent(new Event('change'));
  }

  SaveFiles() {
    const form = document.getElementById('files-form') as HTMLFormElement;
    const totalSize = this.FileListToArray(this.filesInput.files)
      .map(f => f.size)
      .reduce((prev, next) => prev + next);
    this.filesInput.files = this.ArrayToFileList(this.fileArray.map(f => f.file));

    this.apiService.sendFile(this.conversation.conversationId, new FormData(form)).subscribe((event) => {
      switch (event.type) {
        case HttpEventType.UploadProgress:
          this.progressBar = Math.round(100 * event.loaded / totalSize);
          break;
        case HttpEventType.Response:
          this.progressBar = 0;
          this.fileInfo.classList.add('hide_element');
          this.filesInput.files = this.ArrayToFileList([]);
          this.fileArray = [];
          break;
        case HttpEventType.Sent:
        case HttpEventType.ResponseHeader:
          break;
        default:
          console.log('Unhandled event: ' + event.type);
      }
    });
  }
  FileListToArray(fileList: FileList): File[] {
    return Array.prototype.slice.call(fileList);
  }
  ArrayToFileList(fileArray: File[]): FileList {
    const dt = new DataTransfer();
    fileArray.forEach(file => {
      dt.items.add(file);
    });
    return dt.files;
  }
  DisplaySize(bytes: number) {
    const giga = 1000000000;
    const gigaPrefix = 'G';
    const mega = 1000000;
    const megaPrefix = 'M';
    const kilo = 1000;
    const kiloPrefix = 'K';
    let prefix = 'B';
    let result = bytes;
    if (bytes >= giga / 2) {
      prefix = gigaPrefix + prefix;
      result /= giga;
      result = Math.round(result);
    } else if (bytes >= mega / 2) {
      prefix = megaPrefix + prefix;
      result /= mega;
      result = Math.round(result);
    } else if (bytes > kilo / 2) {
      prefix = kiloPrefix + prefix;
      result /= kilo;
      result = Math.round(result);
    }
    return result + ' ' + prefix;
  }
}
