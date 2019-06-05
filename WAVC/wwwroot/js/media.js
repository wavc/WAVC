var audioDevices = [];
var videoDevices = [];
var LocalVideo;

function error(msg) {
    console.log(msg);
}

function Main()
{
    LocalVideo = document.getElementById("camera_preview");
    navigator.mediaDevices.enumerateDevices().
		then(GotDevices).
		catch(error);
    UpdateDevices({ video: true });
}

function GotDevices(deviceList) {
    for (var i = 0; i < deviceList.length; i++) {
        if (deviceList[i].kind === 'audioinput')
            audioDevices.push(deviceList[i].deviceId);
        else if (deviceList[i].kind === 'videoinput')
            videoDevices.push(deviceList[i].deviceId);
    }
    AddRadio(audioDevices, "audio");
    AddRadio(videoDevices, "video");
    if (audioDevices.length > 1 || videoDevices.length > 1) {
        document.getElementById("update_button").innerHTML =
            '<input type="button" value="Update" onclick="UpdateButton()"/>';
    }
}

function UpdateButton() {
    var audio_radios = document.getElementsByName('audio_devices');
    var video_radios = document.getElementsByName('video_devices');
    var selectedAudioDevice = audioDevices.length !== 0 ?
        { deviceId: { exact: audioDevices[0] } } :
        false;
    var selectedVideoDevice = videoDevices.length !== 0 ?
        { deviceId: { exact: videoDevices[0] } } :
        false;

    var audioDeviceId = GetSelectedRadio('audio_devices');
    if (audioDeviceId != null)
    {
        if(audioDeviceId == -1)
            selectedAudioDevice = false;
        else
            selectedAudioDevice = { deviceId: { exact: audioDevices[audioDeviceId] } };
    }
    var videoDeviceId = GetSelectedRadio('video_devices');
    if (videoDeviceId != null)
    {
        //console.log(audioDeviceId);
        if(videoDeviceId == -1)
            selectedVideoDevice = false;
        else
            selectedVideoDevice = { deviceId: { exact: videoDevices[videoDeviceId] } };
    }
    if(videoDeviceId == -1 && audioDeviceId == -1)
    {
        StopVideo();
        return;
    }
    var constraints = {
        audio: selectedAudioDevice,
        video: selectedVideoDevice
    };
    
    UpdateDevices(constraints);
}
function StopVideo()
{
    if(LocalVideo.srcObject!=null)
    LocalVideo.srcObject.getTracks().forEach(function (track) {
        track.stop();
    });
    //LocalVideo.srcObject = null;
}
function UpdateDevices(constraints) {
    StopVideo();
    navigator.mediaDevices.getUserMedia(constraints).
        then(stream => { LocalVideo.srcObject = stream;}).
        catch(error);
}