function SendAJAX(httpMethod, url) {
    var ajax = new XMLHttpRequest();
    var promise = new Promise(onResponse =>
        ajax.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                onResponse(this.responseText);
            }
        });
    ajax.open(httpMethod, url, true);
    ajax.send();
    return promise;
}
function DeleteElement(elementName) {
    try {
        var elementToDelete = document.getElementById(elementName);
        elementToDelete.parentElement.removeChild(elementToDelete);
    } catch{ }
}
function DeleteElements(elementsName) {
    try {
        var videoToDelete = document.getElementsByClassName(elementsName);
        for (var i = 0; i < videoToDelete.length; i++) {
            elementToDelete[i].parentElement.removeChild(elementToDelete[i]);
        }
    } catch{ }
}