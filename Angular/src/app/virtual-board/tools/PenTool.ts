import { Tool, Color, Path } from 'paper';

export class PenTool extends Tool {

    private strokeWidthRef: { Value: number };
    private strokeColor: Color;
    private path: Path;
    private myId: string;

    constructor(private conversationId, private signaRConnection: signalR.HubConnection,
                strokeColor: Color, strokeWidthRef: { Value: number }) {
        super();
        this.strokeColor = strokeColor;
        this.strokeWidthRef = strokeWidthRef;
        this.myId = localStorage.getItem('myId');

    }

    onMouseDown = (event) => {
        this.tryOnMouseDown(event.point, this.strokeColor);
        this.signaRConnection.send('SendOnMouseDownEvent', this.conversationId, this.myId,
        ['pen', event.point, this.strokeColor]);

    }
    onMouseDrag = (event) => {
        this.tryOnMouseDrag(event.point, this.strokeColor, this.strokeWidthRef.Value);
        this.signaRConnection.send('SendOnMouseDragEvent', this.conversationId, this.myId,
        ['pen', event.point, this.strokeColor, this.strokeWidthRef.Value]);
    }

    private tryOnMouseDrag(point: any, strokeColor, strokeWidth) {
        this.path.add(point);
        this.path.strokeWidth = strokeWidth;
        this.path.strokeColor = strokeColor;
        this.path.strokeCap = 'round';
        this.path.name = 'pen';
        this.path.smooth();
    }

    public tryOnMouseDown(point: any, strokeColor) {
        this.path = new Path();
        this.path.strokeColor = strokeColor;
        this.path.add(point);
    }
}
