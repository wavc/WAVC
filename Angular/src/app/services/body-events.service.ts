import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class BodyEvents {
  Listeners: { [event: string]: (this: HTMLElement, ev: DragEvent) => any } = {};
  TempListeners: { [event: string]: (this: HTMLElement, ev: DragEvent) => any } = {};

  Add(event: string, listener: (this: HTMLElement, ev: DragEvent) => any) {
    document.body.addEventListener(event, listener);
    this.Listeners[event] = listener;
  }
  Override(event: string, listener: (this: HTMLElement, ev: DragEvent) => any) {
    document.body.removeEventListener(event, this.Listeners[event]);
    document.body.addEventListener(event, listener);
    this.TempListeners[event] = listener;
  }
  Revert(event: string) {
    document.body.removeEventListener(event, this.TempListeners[event]);
    document.body.addEventListener(event, this.Listeners[event]);
  }
}
