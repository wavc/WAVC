import { Tool, Path, Color } from 'paper';

export class DrawLineTool extends Tool {
    private strokeWidth: { Value: number };
    private strokeColor: Color;
    private myId: string;

    constructor(private conversationId, private signaRConnection: signalR.HubConnection,
                strokeColor: Color, strokeWidth: { Value: number }) {
        super();
        this.strokeColor = strokeColor;
        this.strokeWidth = strokeWidth;
        this.myId = localStorage.getItem('myId');
    }

    onMouseDrag = (event) => {
        const path = new Path.Line({
            from: event.downPoint,
            to: event.point,
            strokeColor: this.strokeColor,
            strokeWidth: this.strokeWidth.Value
        });
        path.name = 'line';
        this.signaRConnection.send('SendOnMouseDragEvent', this.conversationId, this.myId, ['draw', path.exportJSON()]);
        path.removeOnDrag();
    }
    onMouseUp = (event) => {
      this.signaRConnection.send('SendOnMouseUpEvent', this.conversationId, this.myId, null);
    }
}
