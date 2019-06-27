var peer, calls = [];
function SetUpPeer() {
    var myStream = document.getElementById("camera_preview");
    peer = new Peer();
    peer.on('call', function (call) {
        WaitForObject(myStream, (o) => o.srcObject == null, (s) => {
            call.answer(s.srcObject);
        });
        SetUpCall(call);
    });
    peer.on('close', (e) => { console.log(e); });
    peer.on('disconnected', (e) => { console.log(e); });
    peer.on('error', (e) => { console.log(e); });
}
function SetUpCall(call) {
    call.on('stream', function (remoteStream) {
        console.log("Got Stream");

        var oldCalls = calls.filter(c => c.peer == call.peer);
        for (var i = 0; i < oldCalls.length; i++)
            oldCalls[i].close();
        var remoteName;
        if (myName == call.metadata.caller)
            remoteName = call.metadata.recipient;
        else
            remoteName = call.metadata.caller;

        AddRemoteVideoElement(remoteStream, call.id, remoteName);
        calls.push(call);
    });
    call.on('close', function () {
        console.log("Closed Stream");
        calls = calls.filter((c) => {
            return c !== call;
        });
        DeleteElement(call.id);
    });
}
function UpdateCall() {
    for (var i = 0; i < calls.length; i++) {
        MakeCall({ peerId: calls[i].peer });
        calls[i].close();
    }
}
function AddRemoteVideoElement(remoteStream, id, name) {
    var container = document.getElementById("video_container");
    var videoHolder = document.createElement("div");
    videoHolder.innerHTML += name + "<br/>";
    var video = document.createElement("video");
    video.setAttribute("autoplay", "");
    video.setAttribute("playinline", "");
    video.setAttribute("id", id);
    video.srcObject = remoteStream;
    videoHolder.appendChild(video);
    container.appendChild(videoHolder);
}
function MakeCall(user) {
    var myStream = document.getElementById("camera_preview");
    var call = peer.call(user.peerId, myStream.srcObject, { metadata: { caller: myName, recipient: user.name } });
    SetUpCall(call);
}
