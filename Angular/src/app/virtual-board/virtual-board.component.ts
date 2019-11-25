import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ColorPickerModule, Rgba } from 'ngx-color-picker';
import { Project, Path, Tool, Color, Point, Segment } from 'paper';
import * as paper from 'paper';
import { Options } from 'ng5-slider';
import { DrawRectangleTool } from './tools/DrawRectangleTool';
import { DrawLineTool } from './tools/DrawLineTool';
import { PenTool } from './tools/PenTool';
import { DrawEllipseTool } from './tools/DrawEllipseTool';
import { FillerTool } from './tools/FillerTool';
import { EraserTool } from './tools/EraserTool';
import { HandTool } from './tools/HandTool';
import { SignalRService } from '../services/signal-r.service';

@Component({
  selector: 'app-virtual-board',
  templateUrl: './virtual-board.component.html',
  styleUrls: ['./virtual-board.component.css']
})
export class VirtualBoardComponent implements OnInit {

    // @ViewChild('screen', {static: true}) screen: ElementRef;
    // @ViewChild('canvas', {static: true}) canvas: ElementRef;
    // @ViewChild('downloadLink', {static: true}) downloadLink: ElementRef;

  private project: Project;
  private fillColor = new Color(255, 0, 0);
  private strokeColor = new Color(0, 0, 0);
  private strokeWidthRef = { Value: 7 };
  private colorStroke = "#000000";
  private colorFill = "#FFFFFF";
  

  private hitOptions = {
    segments: true,
    stroke: true,
    fill: true,
    tolerance: 5
  };
  private path: any;
  private segment: any;
  private clickedItem: any;
  private tools: Record<string, any> = {};

  private friendActions: Record<string, Record<string, any>> = {}

  activeToolName = "pen";
  sliderValue:any;
  sliderOptions: Options = {
    showTicksValues: true,
    animate: false,
    floor: 2,
    ceil: 16,
    step: 2
  };

  private view :any;
  private counter = 0;
  private signalRConnection: signalR.HubConnection;

  private tempPath: any;
  private previousEventType:any;
  private myId;
  private readonly ON_MOUSE_DRAG_EVENT = "OnMouseDragEvent";
  private readonly ON_MOUSE_UP_EVENT = "OnMouseUpEvent";
  private readonly ON_MOUSE_DOWN_EVENT = "OnMouseDownEvent";

  constructor(private signalRService: SignalRService) {
            this.myId = localStorage.getItem('myId');
   };

  ngOnInit() {
    paper.setup('main-canvas');
    this.view = paper.view
    this.project = paper.project;
   
    this.signalRConnection = this.signalRService.startConnection('/VirtualBoard'); 
    this.configureSignalRConnection();
    this.initializeTools();
    this.tools[this.activeToolName].activate();
    }

  private configureSignalRConnection() {
    this.configureOnMouseDragSignalREvent();
    this.configureOnMouseUpSignalREvent();
    this.configureOnMouseDownSignalREvent();
  }

  private createNewColor(data){
    return new Color(data[1], data[2], data[3], data[4]);
  }
  private createNewPoint(data){
    return new Point(data[1], data[2]);
  }

  private configureOnMouseDownSignalREvent() {
    this.signalRConnection.on('SendOnMouseDownEvent', (senderId, data) => {
       if (senderId === this.myId) {
          return;
        }
      
      if(data[0] === "fill"){
        this.onDragFiller(data, senderId);
      }
      else if(data [0] === "hand"){
        this.onDragHand(data);
      }
      else if(data [0] === "eraser"){
        this.onDragEraser(data);
      }
      else if (data[0] === "pen"){
        this.onDragPen(data);
      }
    });
  }

  private onDragPen(data: any) {
    let point = this.createNewPoint(data[1]);
    let strokeColor = this.createNewColor(data[2]);
    this.tools["pen"].tryOnMouseDown(point, strokeColor);
  }

  private onDragEraser(data: any) {
    let point = this.createNewPoint(data[1]);
    let hitResult = this.project.hitTest(point, this.hitOptions);
    this.tools["eraser"].tryRemove(hitResult);
  }

  private onDragHand(data: any) {
    let point = this.createNewPoint(data[1]);
    this.tools["hand"].tryOnMouseDownEventOnPoint(point);
  }

  private onDragFiller(data: any, senderId: any) {
    let point = this.createNewPoint(data[1]);
    let color = this.createNewColor(data[2]);
    let hitResult = this.project.hitTest(point, this.hitOptions);
    if (hitResult)
      this.tools['filler'].tryFill(hitResult, color);
    this.setUsersLastEvent(senderId, this.ON_MOUSE_DOWN_EVENT);
  }

  private configureOnMouseUpSignalREvent() {
    this.signalRConnection.on('SendOnMouseUpEvent', (senderId, data) => {
       if (senderId === this.myId) {
          return;
        }

       if (this.friendActions[senderId]){
         this.setUsersPathObject(senderId, null);
         this.setUsersLastEvent(senderId, this.ON_MOUSE_UP_EVENT); 
       }
    });
  }

  private configureOnMouseDragSignalREvent() {
    this.signalRConnection.on('SendOnMouseDragEvent', (senderId, data) => {
      //data = [Path]
       if (senderId === this.myId) {
          return;
        }
      if (data[0]==="draw"){
        if (!this.friendActions[senderId]) {
          this.createNewUserInFriendsActivity(senderId, data[1]);
          return;
        }
        if (this.getUsersPathObject(senderId) != null && this.getUsersLastEvent(senderId) == this.ON_MOUSE_DRAG_EVENT) {
          this.removeUsersPathObject(senderId);
        }
        this.setUsersPathObject(senderId, this.project.activeLayer.importJSON(data[1]));
        this.setUsersLastEvent(senderId, this.ON_MOUSE_DRAG_EVENT);
      }
      else if (data[0] === "hand"){
        let point = this.createNewPoint(data[1]);
        this.tools["hand"].tryOnMouseDragWithDelta(point);
      }
      else if (data[0] === "pen"){
        let point = this.createNewPoint(data[1]);
        let strokeColor = this.createNewColor(data[2]);
        this.tools["pen"].tryOnMouseDrag(point, strokeColor,data[3]);
      }
    });
  }

  private removeUsersPathObject(senderId: any) {
    this.friendActions[senderId]['path'].remove();
  }

  private createNewUserInFriendsActivity(senderId: any, data: any) {
    this.friendActions[senderId] = {};
    this.friendActions[senderId]['path'] = this.project.activeLayer.importJSON(data);
    this.friendActions[senderId]['event'] = event;
  }

  private setUsersPathObject(userId, object){
    this.friendActions[userId]['path'] = object;
  }

  private getUsersPathObject(userId){
    return this.friendActions[userId]['path']
  }

  private setUsersLastEvent(userId, event){
    this.friendActions[userId]['event'] = event;
  }

   private getUsersLastEvent(userId){
    return this.friendActions[userId]['event']
  } 

  private initializeTools() {
    this.tools['rectangle'] = new DrawRectangleTool(this.signalRConnection, this.fillColor, this.strokeColor, this.strokeWidthRef);
    this.tools['line'] = new DrawLineTool(this.signalRConnection, this.strokeColor, this.strokeWidthRef);
    this.tools['pen'] = new PenTool(this.signalRConnection, this.strokeColor, this.strokeWidthRef);
    this.tools['ellipse'] = new DrawEllipseTool(this.signalRConnection, this.strokeColor, this.fillColor, this.strokeWidthRef);
    this.tools['filler'] = new FillerTool(this.signalRConnection, this.fillColor, this.project, this.hitOptions);
    this.tools['eraser'] = new EraserTool(this.signalRConnection, this.project, this.hitOptions);
    this.tools['hand'] = new HandTool(this.signalRConnection, this.project, this.hitOptions);
  }

  OnStrokeColorChanged(color: string) {
    let rgba = this.extractColor(color);
    this.changeColor(this.strokeColor, rgba);
  }

  OnFillerColorChanged(color: string) {
    let rgba = this.extractColor(color);
    this.changeColor(this.fillColor, rgba);
  }

  private extractColor(color: string) {
    return color.replace('rgba(', '').replace(')', '')
      .split(',').map((val, index) => index != 3 ? (+val) / 255 : (+val));
  }

  private changeColor(color: Color, rgba: number[]) {
    color.red = rgba[0];
    color.green = rgba[1];
    color.blue = rgba[2];
    color.alpha = rgba[3];
  }

  rgba(red: number, green: number, blue: number, alpha: number) {
    return new Color(red, green, blue, alpha);
  }

  onToolButtonClicked(event) {
    const buttonName = event.srcElement.name;
    this.tools[buttonName].activate();
    this.activeToolName = buttonName;
  }  

  onSliderValueChange(value){
    this.strokeWidthRef.Value = value;
  }
  onDownloadButtonClicked(event){
  //  html2canvas(this.screen.nativeElement).then(canvas => {
  //     this.canvas.nativeElement.src = canvas.toDataURL();
  //     this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
  //     this.downloadLink.nativeElement.download = 'marble-diagram.png';
  //     this.downloadLink.nativeElement.click();
  //   });
  }
  isActive(event){
     const buttonName = event.srcElement.name;
     return buttonName == this.activeToolName;
  }
}

