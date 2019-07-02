var overlay, overlayText, filesInput, entered = 0;
window.onload = () => {
    overlay = document.getElementById("overlay");
    overlayText = document.getElementById("overlay_text");
    filesInput = document.getElementById("files");

    document.body.addEventListener("dragenter", StartedDragging);
    document.body.addEventListener("dragleave", EndedDragging);
    document.body.addEventListener("dragover", PreventOpen);
    document.body.addEventListener("drop", Dropped);

    filesInput.addEventListener("change", FilesChanged);
}
function StartedDragging(e) {
    entered++;
    if (entered == 1) {
        overlay.classList.add("drag_entered");
        overlayText.classList.remove("hide_element");
    }
}
function PreventOpen(e) {
    e.preventDefault();
}
function EndedDragging(e) {
    entered--;
    if (entered == 0) {
        overlay.classList.remove("drag_entered");
        overlayText.classList.add("hide_element");
    }
}
function Dropped(e) {
    PreventOpen(e);
    EndedDragging(e);
    filesInput.files = e.dataTransfer.files;
    filesInput.dispatchEvent(new Event("change"));
}
function FilesChanged() {
    var totalSize = 0;
    for (var i = 0; i < filesInput.files.length; i++) {
        totalSize += filesInput.files[i].size;
    }
    console.log(totalSize);
    var form = document.getElementById("form");
    var progressBar = document.getElementById("progress");
    var ajax = new XMLHttpRequest();
    ajax.upload.addEventListener("progress", (e) => progressBar.value = 100 * e.loaded / totalSize);
    ajax.open("POST", "/Upload/Upload");
    ajax.send(new FormData(form));
}