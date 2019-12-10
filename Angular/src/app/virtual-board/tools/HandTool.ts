import { Tool, Project, Point, Path } from 'paper';

export class HandTool extends Tool {

    private project: Project;
    private hitOptions: any;
    private segment: any;
    private path: any;
    private myId: string;

    constructor(private conversationId, private signaRConnection: signalR.HubConnection, project: Project, hitOptions: any) {
        super();
        this.project = project;
        this.hitOptions = hitOptions;
        this.myId = localStorage.getItem('myId');

    }

    onMouseDown = (event) => {
        this.tryOnMouseDownEventOnPoint(event.point);
        this.signaRConnection.send('SendOnMouseDownEvent', this.conversationId, this.myId, ['hand', event.point]);
    }

    onMouseDrag = (event) => {
        this.tryOnMouseDragWithDelta(event.delta);
        this.signaRConnection.send('SendOnMouseDragEvent', this.conversationId, this.myId, ['hand', event.delta]);

    }
    onMouseMove = (event) => {
        const hitResult = this.project.hitTest(event.point, this.hitOptions);
        this.project.activeLayer.selected = false;
        if (hitResult && hitResult.item) {
            hitResult.item.selected = true;
        }
    }

    public tryOnMouseDragWithDelta(delta) {
        if (this.segment) {
            switch (this.path.name) {
                case 'rectangle':
                    console.log('rect');
                    this.resizeRectangle(delta);
                    break;
                case 'circle':
                    this.resizeCircle(this.path, this.segment, delta);
                    break;
                case 'ellipse':
                    this.resizeEllipse(this.path, this.segment, delta);
                    break;
                case 'line':
                    this.resizeLine(this.path, this.segment, delta);
                    break;
                case 'pen':
                    this.moveFigure(this.path, delta);
                    break;
            }
        } else if (this.path) {
            this.moveFigure(this.path, delta);
        }
    }

    public tryOnMouseDownEventOnPoint(point: any) {
        this.segment = null;
        this.path = null;
        const hitResult = this.project.hitTest(point, this.hitOptions);
        if (hitResult) {
            this.path = hitResult.item;
            if (this.path.name === 'ellipse') {
                this.path.bounds.visible = true;
            }
            if (hitResult.type === 'segment') {
                this.segment = hitResult.segment;
                this.segment.selected = true;
            }
            hitResult.item.bringToFront();
        }
    }

    private moveFigure(path, delta) {
        path.position = path.position.add(delta);
    }

    private resizeRectangle(delta: any) {
        console.log('resizing');
        const type = this.segment.index % 2 ? 'side' : 'corner';
        if (type === 'side') {
            const segmentsToMove = [];
            segmentsToMove.push(this.segment);
            segmentsToMove.push(this.segment.next);
            segmentsToMove.push(this.segment.previous);
            const restrictedDelta = (this.segment.index - 1) % 4 ? new Point(0, delta.y) : new Point(delta.x, 0);
            // for (let i = 0; i < segmentsToMove.length; i++) {
            //     segmentsToMove[i].point = segmentsToMove[i].point.add(restrictedDelta);
            for (const segment of segmentsToMove) {
                segment.point = segment.point.add(restrictedDelta);
            }
        } else if (type === 'corner') {
            const segmentsToMoveV = [];
            const segmentsToMoveH = [];

            if (this.segment.index % 4 === 0) {
                this.pushNexts(segmentsToMoveH, this.segment);
                this.pushPreviouses(segmentsToMoveV, this.segment);
            } else {
                this.pushNexts(segmentsToMoveV, this.segment);
                this.pushPreviouses(segmentsToMoveH, this.segment);
            }
            // for (let i = 0; i < segmentsToMoveV.length; i++) {
            //     segmentsToMoveV[i].point = segmentsToMoveV[i].point.add(new Point(0, delta.y));
            // }
            for (const segment of segmentsToMoveV) {
                segment.point = segment.point.add(new Point(0, delta.y));
            }
            // for (let i = 0; i < segmentsToMoveH.length; i++) {
            //     segmentsToMoveH[i].point = segmentsToMoveH[i].point.add(new Point(delta.x, 0));
            // }
            for (const segment of segmentsToMoveH) {
                segment.point = segment.point.add(new Point(delta.x, 0));
            }
        }
        this.updateRectangleMidSegments(this.path);
        console.log(this.path);
    }

    private pushNexts(segmentsToMove, segment) {
        segmentsToMove.push(segment);
        segmentsToMove.push(segment.next);
        segmentsToMove.push(segment.next.next);
    }

    private pushPreviouses(segmentsToMove, segment) {
        segmentsToMove.push(segment);
        segmentsToMove.push(segment.previous);
        segmentsToMove.push(segment.previous.previous);
    }

    private updateRectangleMidSegments(rect) {
        // TODO to change to loop with next previous
        rect.segments[1].point.y = (rect.segments[0].point.y + rect.segments[2].point.y) / 2;
        rect.segments[3].point.x = (rect.segments[2].point.x + rect.segments[4].point.x) / 2;
        rect.segments[5].point.y = (rect.segments[4].point.y + rect.segments[6].point.y) / 2;
        rect.segments[7].point.x = (rect.segments[0].point.x + rect.segments[6].point.x) / 2;
    }

    resizeEllipse(path, segment, delta) {
        // TODO FIX
        const restrictedDelta = segment.index % 2 ? new Point(0, delta.y) : new Point(delta.x, 0);
        segment.point = segment.point.add(restrictedDelta);
        segment.next.point = segment.next.point.add(restrictedDelta.divide(new Point(2, 2)));
        segment.previous.point = segment.previous.point.add(restrictedDelta.divide(new Point(2, 2)));
        path.smooth();
    }
    resizeCircle(path, segment, delta) {
        // TODO FIX
        const restrictedDelta = segment.index % 2 ? new Point(0, delta.y) : new Point(delta.x, 0);
        segment.point = segment.point.add(restrictedDelta);
        segment.next.point = segment.next.point.add(
            new Point(-restrictedDelta.y, restrictedDelta.x).add(restrictedDelta).divide(new Point(2, 2)));
        segment.previous.point = segment.previous.point.add(
            new Point(restrictedDelta.y, -restrictedDelta.x).add(restrictedDelta).divide(new Point(2, 2)));
        path.smooth();
    }

    resizeLine(path, segment, delta) {
        segment.point = segment.point.add(delta);
        path.smooth();
    }
}
