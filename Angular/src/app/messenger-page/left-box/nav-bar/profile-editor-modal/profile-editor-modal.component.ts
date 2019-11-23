import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ProfileService } from '../../../../services/profile.service';
import { HttpEventType } from '@angular/common/http';
import { ApplicationUserModel } from 'src/app/models/application-user.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BodyEvents } from 'src/app/services/body-events.service';

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

  constructor(private profileService: ProfileService, public modal: NgbActiveModal, private bodyEvents: BodyEvents) { }

  ngOnInit() {
    this.overlay = document.getElementById('profile_overlay');
    this.overlayText = document.getElementById('profile_overlay_text');
    this.filesInput = document.getElementById('profile_pic') as HTMLInputElement;
    this.dragenter = (e) => this.StartedDragging(e);
    this.dragleave = (e) => this.EndedDragging(e);
    this.dragover = (e) => this.PreventOpen(e);
    this.drop = (e) => this.Dropped(e);
    this.bodyEvents.Override('dragenter', this.dragenter);
    this.bodyEvents.Override('dragleave', this.dragleave);
    this.bodyEvents.Override('dragover', this.dragover);
    this.bodyEvents.Override('drop', this.drop);
  }

  ngOnDestroy(): void {
    this.bodyEvents.Revert('dragenter');
    this.bodyEvents.Revert('dragleave');
    this.bodyEvents.Revert('dragover');
    this.bodyEvents.Revert('drop');
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
    if (e.dataTransfer.files[0].type.startsWith('image/')) {
      this.filesInput.files = e.dataTransfer.files;
      this.filesInput.dispatchEvent(new Event('change'));
    } else {
      alert('Only image types are supported!');
    }
  }
  SaveProfile() {
    const form = document.getElementById('profile-form') as HTMLFormElement;
    const progress = document.getElementById('profile-save-progress');
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
