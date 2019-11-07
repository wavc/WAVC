import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ProfileService } from '../../../../services/profile.service';
import { HttpEventType } from '@angular/common/http';
import { ApplicationUserModel } from 'src/app/models/application-user.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-profile-editor-modal',
  templateUrl: './profile-editor-modal.component.html',
  styleUrls: ['./profile-editor-modal.component.css']
})
export class ProfileEditorModalComponent implements OnInit, OnDestroy {
  overlay: HTMLElement;
  overlayText: HTMLElement;
  filesInput: HTMLInputElement;
  entered = 0;
  @Input() profile: ApplicationUserModel;
  dragenter: (this: HTMLElement, ev: DragEvent) => any;
  dragleave: (this: HTMLElement, ev: DragEvent) => any;
  dragover: (this: HTMLElement, ev: DragEvent) => any;
  drop: (this: HTMLElement, ev: DragEvent) => any;

  constructor(private profileService: ProfileService, public modal: NgbActiveModal) { }

  ngOnInit() {
    this.overlay = document.getElementById('overlay');
    this.overlayText = document.getElementById('overlay_text');
    this.filesInput = document.getElementById('files') as HTMLInputElement;
    this.dragenter = (e) => this.StartedDragging(e);
    this.dragleave = (e) => this.EndedDragging(e);
    this.dragover = (e) => this.PreventOpen(e);
    this.drop = (e) => this.Dropped(e);
    document.body.addEventListener('dragenter', this.dragenter);
    document.body.addEventListener('dragleave', this.dragleave);
    document.body.addEventListener('dragover', this.dragover);
    document.body.addEventListener('drop', this.drop);
  }

  ngOnDestroy(): void {
    document.body.removeEventListener('dragenter', this.dragenter);
    document.body.removeEventListener('dragleave', this.dragleave);
    document.body.removeEventListener('dragover', this.dragover);
    document.body.removeEventListener('drop', this.drop);
  }

  StartedDragging(e) {
    this.entered++;
    if (this.entered === 1) {
      this.overlay.classList.add('drag_entered');
      this.overlayText.classList.remove('hide_element');
    }
  }
  PreventOpen(e) {
    e.preventDefault();
  }
  EndedDragging(e) {
    this.entered--;
    if (this.entered === 0) {
      this.overlay.classList.remove('drag_entered');
      this.overlayText.classList.add('hide_element');
    }
  }
  Dropped(e: DragEvent) {
    this.PreventOpen(e);
    this.EndedDragging(e);
    if (e.dataTransfer.files[0].type.startsWith('image/')) {
      this.filesInput.files = e.dataTransfer.files;
      this.filesInput.dispatchEvent(new Event('change'));
    } else {
      alert('Only image types are supported!');
    }
  }
  SaveProfile() {
    const form = document.getElementById('profile-form') as HTMLFormElement;
    const progress = document.getElementById('save-progress');
    this.profileService.saveProfile(new FormData(form)).subscribe((event) => {
      switch (event.type) {
        case HttpEventType.UploadProgress:
          progress.innerHTML = Math.round(100 * event.loaded / event.total) + '%';
          break;
        case HttpEventType.Response:
          this.modal.close();
          break;
        default:
          return 'Unhandled event: ${event.type}';
      }
    });
  }
}
