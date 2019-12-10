import { Tool, Color, Point, Path } from 'paper';

export class DrawRectangleTool extends Tool {


    private strokeWidth: { Value: number };
    private fillColor: Color;
    private strokeColor: Color;
    private myId: string;

    constructor(private conversationId, private signaRConnection: signalR.HubConnection,
                fillColor: Color, strokeColor: Color, strokeWidth: { Value: number }) {
      super();
      this.fillColor = fillColor;
      this.strokeColor = strokeColor;
      this.strokeWidth = strokeWidth;
      this.myId = localStorage.getItem('myId');
    }

    onMouseDrag = (event) => {
      const path = new Path.Rectangle({
        from: event.downPoint,
        to: event.point,
        fillColor: this.fillColor,
        strokeColor: this.strokeColor,
        strokeWidth: this.strokeWidth.Value
      });
      // Add mid segments between two neighbor ones (for resizing ease)
      const seg1 = new Point(path.segments[0].point.x, (path.segments[0].point.y + path.segments[1].point.y) / 2);
      const seg2 = new Point((path.segments[1].point.x + path.segments[2].point.x) / 2, path.segments[1].point.y);
      const seg3 = new Point(path.segments[2].point.x, (path.segments[2].point.y + path.segments[3].point.y) / 2);
      const seg4 = new Point((path.segments[0].point.x + path.segments[3].point.x) / 2, path.segments[0].point.y);

      path.insert(1, seg1);
      path.insert(3, seg2);
      path.insert(5, seg3);
      path.insert(7, seg4);
      path.name = 'rectangle';

      this.signaRConnection.send('SendOnMouseDragEvent', this.conversationId, this.myId, ['draw', path.exportJSON()]);
      path.removeOnDrag();
    }
    onMouseUp = (event) => {
      this.signaRConnection.send('SendOnMouseUpEvent', this.conversationId, this.myId, null);
    }
  }
