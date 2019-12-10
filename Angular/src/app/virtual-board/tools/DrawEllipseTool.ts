import { Tool, Color, Path, Rectangle } from 'paper';

export class DrawEllipseTool extends Tool {

    private strokeWidthRef: { Value: number };
    private strokeColor: Color;
    private fillColor: Color;
    private myId: string;

    constructor(private conversationId, private signaRConnection: signalR.HubConnection,
                strokeColor: Color, fillColor: Color, strokeWidthRef: { Value: number }) {
        super();
        this.strokeColor = strokeColor;
        this.fillColor = fillColor;
        this.strokeWidthRef = strokeWidthRef;
        this.myId = localStorage.getItem('myId');
    }

    onMouseDrag = (event) => {
        const rect = new Rectangle(event.downPoint, event.point);
        const path = new Path.Ellipse(rect);
        path.strokeWidth = this.strokeWidthRef.Value;
        path.strokeColor = this.strokeColor;
        path.fillColor = this.fillColor;
        path.name = 'ellipse';
        this.signaRConnection.send('SendOnMouseDragEvent', this.conversationId, this.myId, ['draw', path.exportJSON()]);
        path.removeOnDrag();
    }

    onMouseUp = (event) => {
      this.signaRConnection.send('SendOnMouseUpEvent', this.conversationId, this.myId, null);
    }
}
