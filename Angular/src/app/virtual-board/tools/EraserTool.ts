import { Tool, Color, Project } from 'paper';

export class EraserTool extends Tool {
    private project: Project
    private hitOptions: any;
    private myId: string;
   
    constructor(private signaRConnection:signalR.HubConnection, project: Project, hitOptions: any) {
        super();
        this.project = project;
        this.hitOptions = hitOptions;
         this.myId = localStorage.getItem('myId');
    }

    onMouseDown = (event) => {
        let hitResult = this.project.hitTest(event.point, this.hitOptions);
        this.tryRemove(hitResult);
        this.signaRConnection.send('SendOnMouseDownEvent',this.myId, ["eraser", event.point]);
    }
    onMouseMove = (event) => {
        let hitResult = this.project.hitTest(event.point, this.hitOptions);
        this.project.activeLayer.selected = false;
        if (hitResult && hitResult.item)
            hitResult.item.selected = true;
    }

    private tryRemove(hitResult: paper.HitResult) {
        if (hitResult) {
            hitResult.item.remove();
        }
    }
}