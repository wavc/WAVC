// JavaScript Document



var strokeWidthSlider = document.getElementById("strokeWidthSlider");
var strokePicker = document.getElementById("strokePicker");
var fillPicker = document.getElementById("fillPicker");

var strokeWidth = strokeWidthSlider.value;
var strokeColor = strokePicker.value;
var fillColor = fillPicker.value;

strokeWidthSlider.oninput = function () {
    console.log("width slider: " + this.value);
    strokeWidth = this.value;
}

strokePicker.oninput = function () {
    console.log(this.value);
    strokeColor = this.value;
}

fillPicker.oninput = function () {
    fillColor = this.value;
}

var hitOptions = {
    segments: true,
    stroke: true,
    fill: true,
    tolerance: 5
};

var path;
function onMouseDown(event) {
    path = new Path();
    path.strokeColor = 'black';
    path.add(event.point);
}

window.app = {
    pen: new Tool({
        onMouseDown: onMouseDown,
        onMouseDrag: function (event) {
            path.add(event.point);
            path.strokeWidth = strokeWidth;
            path.strokeColor = strokeColor;
            path.name = "pen";
            path.smooth();
        }
    }),

    circle: new Tool({
        onMouseDrag: function (event) {
            var path = new Path.Circle({
                center: event.downPoint,
                radius: (event.downPoint - event.point).length,
                fillColor: fillColor,
                strokeColor: strokeColor,
                strokeWidth: strokeWidth
            });

            path.name = "circle";
            path.removeOnDrag();
        }
    }),

    rectangle: new Tool({
        
        onMouseDrag: function (event) {
       
            var path = new Path.Rectangle({
                from: event.downPoint,
                to: event.point,
                fillColor: fillColor,
                strokeColor: strokeColor,
                strokeWidth: strokeWidth
            });
            //Add a mid segments between two neighbor ones
            var seg1 = new Point(path.segments[0].point.x, (path.segments[0].point.y + path.segments[1].point.y) / 2);
            var seg2 = new Point((path.segments[1].point.x + path.segments[2].point.x) / 2, path.segments[1].point.y);
            var seg3 = new Point(path.segments[2].point.x, (path.segments[2].point.y + path.segments[3].point.y) / 2);
            var seg4 = new Point((path.segments[0].point.x + path.segments[3].point.x) / 2, path.segments[0].point.y);


            path.insert(1, seg1);
            path.insert(3, seg2);
            path.insert(5, seg3);
            path.insert(7, seg4);

            path.name = "rectangle";
            path.removeOnDrag();

        }
    }),

    line: new Tool({
        onMouseDrag: function (event) {
            var path = new Path.Line({
                from: event.downPoint,
                to: event.point,
                strokeColor: strokeColor,
                strokeWidth: strokeWidth
            })
            path.name = "line";
            path.removeOnDrag();
        }
    }),

    ellipse: new Tool({
        onMouseDrag: function (event) {
            var rect = new Rectangle(event.downPoint, event.point);
            var path = new Path.Ellipse(rect);
            path.strokeWidth = strokeWidth;
            path.strokeColor = strokeColor;
            path.fillColor = fillColor;
            path.name = "ellipse"
            path.removeOnDrag();
        }
    }),

    filler: new Tool({
        onMouseDown: function (event) {
            var hitResult = project.hitTest(event.point, hitOptions)
            console.log(hitResult);
            if (hitResult.type == 'fill') {
                hitResult.item.fillColor = fillColor;

            }
        }
    }),

    hand: new Tool({
        onMouseDown: function (event) {
            segment = path = null;
            var hitResult = project.hitTest(event.point, hitOptions);
            clickedItem = null;
            //click segment with Ctrl pressed to delete it
            if (event.modifiers.control) {
                if (hitResult.type == 'segment') {
                    hitResult.segment.remove();
                };
                return;
            }

            if (hitResult) {
                path = hitResult.item;

                //if segment was clicked
                if (hitResult.type == 'segment') {
                    segment = hitResult.segment;
                    segment.selected = true;
                }

                hitResult.item.bringToFront();
                console.log(hitResult.item.name);
            }
        },

        //highlight item under the cursor
        onMouseMove: function (event) {
            var hitResult = project.hitTest(event.point, hitOptions);
            project.activeLayer.selected = false;
            if (hitResult && hitResult.item)
                hitResult.item.selected = true;
        },

        onMouseDrag: function (event) {
            if (segment) {
                switch (path.name) {
                    case "rectangle":
                        //TODO refactor following code with segment.index, segment.next, segment.previous properties
                        var type = segment.index % 2 ? "side" : "corner";

                        if (type == "side") {
                            var segmentsToMove = [];

                            segmentsToMove.push(segment);
                            segmentsToMove.push(segment.next);
                            segmentsToMove.push(segment.previous);

                            var restrictedDelta = (segment.index - 1) % 4 ? new Point(0, event.delta.y) : new Point(event.delta.x, 0);

                            for (var i = 0; i < segmentsToMove.length; i++)
                                segmentsToMove[i].point += restrictedDelta;

                        }
                        else if (type == "corner") {

                            var segmentsToMoveV = [];
                            var segmentsToMoveH = [];

                            if (segment.index % 4 == 0) {
                                pushNexts(segmentsToMoveH, segment);
                                pushPreviouses(segmentsToMoveV, segment);
                            }
                            else {
                                pushNexts(segmentsToMoveV, segment);
                                pushPreviouses(segmentsToMoveH, segment);
                            }

                            for (var i = 0; i < segmentsToMoveV.length; i++) {
                                segmentsToMoveV[i].point += new Point(0, event.delta.y);
                            }

                            for (var i = 0; i < segmentsToMoveH.length; i++) {
                                segmentsToMoveH[i].point += new Point(event.delta.x, 0);
                            }
                        }
                        updateRectangleMidSegments(path);
                        break;

                    case "ellipse":
                        console.log(segment.index);

                        var restrictedDelta = segment.index % 2 ? new Point(0, event.delta.y) : new Point(event.delta.x, 0);

                        segment.point += restrictedDelta;
                        segment.next.point += restrictedDelta / 2;
                        segment.previous.point += restrictedDelta / 2;

                        //path.smooth();
                        break;
                    case "circle":
                        //It can be done in a prettier way. Using matrix transofrm for instance.
                        var restrictedDelta = segment.index % 2 ? new Point(0, event.delta.y) : new Point(event.delta.x, 0);
                        segment.point += restrictedDelta;
                        segment.next.point += (new Point(-restrictedDelta.y, restrictedDelta.x) + restrictedDelta) / 2;
                        segment.previous.point += (new Point(restrictedDelta.y, -restrictedDelta.x) + restrictedDelta) / 2;
                        path.smooth();
                        break;
                    case "line":
                        segment.point += event.delta;
                        break;
                    case "pen":
                        //TODO    
                        break;
                    default:
                        break;
                }
            } else if (path) { //move item with mouse
                path.position += event.delta;
            }
        }
    }),
    eraser: new Tool({
        onMouseDown: function (event) {
            segment = path = null;
            var hitResult = project.hitTest(event.point, hitOptions);
            clickedItem = null;
            
            if (hitResult) {
                path = hitResult.item;

                console.log(hitResult.item.name);
                hitResult.item.remove();
            }
        },

        //highlight item under the cursor
        onMouseMove: function (event) {
            var hitResult = project.hitTest(event.point, hitOptions);
            project.activeLayer.selected = false;
            if (hitResult && hitResult.item)
                hitResult.item.selected = true;
        }
    })

}



function pushNexts(segmentsToMove, segment) {
    segmentsToMove.push(segment);
    segmentsToMove.push(segment.next);
    segmentsToMove.push(segment.next.next);
}

function pushPreviouses(segmentsToMove, segment) {
    segmentsToMove.push(segment);
    segmentsToMove.push(segment.previous);
    segmentsToMove.push(segment.previous.previous);
}

function updateRectangleMidSegments(rect) {
    rect.segments[1].point.y = (rect.segments[0].point.y + rect.segments[2].point.y) / 2;
    rect.segments[3].point.x = (rect.segments[2].point.x + rect.segments[4].point.x) / 2;
    rect.segments[5].point.y = (rect.segments[4].point.y + rect.segments[6].point.y) / 2;
    rect.segments[7].point.x = (rect.segments[0].point.x + rect.segments[6].point.x) / 2;
}
