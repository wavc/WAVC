﻿function WaitForObject(object, Condition, Handler) {
    if (Condition(object))
        setTimeout(() => { WaitForObject(object, Condition, Handler); }, 200);
    else Handler(object);
}
/*function WaitForMultipleObjects(objectArray, Condition, Handler) {
    console.log(objectArray);
    WaitForObject(objectArray[0], Condition, (x) => {
        objectArray.shift();
        if (objectArray.length == 0)
            Handler();
        else
            WaitForMultipleObjects(objectArray, Condition, Handler);
    });
}*/
function DeleteElement(elementName) {
    try {
        var videoToDelete = document.getElementById(elementName);
        videoToDelete.parentElement.removeChild(videoToDelete);
    } catch{ }
}