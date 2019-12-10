import { Tool, Color, Project } from 'paper';

export class FillerTool extends Tool {
    private fillColor: Color;
    private project: Project;
    private hitOptions: any;
    private myId: string;

    constructor(private conversationId, private signaRConnection: signalR.HubConnection,
                fillColor: Color, project: Project, hitOptions: any) {
        super();
        this.fillColor = fillColor;
        this.project = project;
        this.hitOptions = hitOptions;
        this.myId = localStorage.getItem('myId');
    }

    onMouseDown = (event) => {
        const hitResult = this.project.hitTest(event.point, this.hitOptions);
        if (this.tryFill(hitResult, this.fillColor)) {
            this.signaRConnection.send('SendOnMouseDownEvent', this.conversationId, this.myId, ['fill', event.point, this.fillColor]);
        }

    }

    public tryFill(hitResult: paper.HitResult, fillColor: Color) {
        if (hitResult !== null && hitResult.type === 'fill') {
            hitResult.item.fillColor = fillColor;
            return true;
        }
        return false;
    }
}
