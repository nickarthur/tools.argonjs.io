var app = Argon.init();

app.context.setDefaultReferenceFrame(app.context.localOriginEastNorthUp);

//is there a better way to access the video element?
var video = Argon.ArgonSystem.instance.container.get(Argon.LiveVideoRealityLoader).videoElement;
var flow = new oflow.VideoFlow(video);

var dx = 0;
flow.onCalculated((dir) => { dx += dir.u; });

var button = document.getElementById("calibrateButton");

function calibrate() {
    button.disabled = true;
    dx = 0;
    var oldOrientation = app.context.getEntityPose(app.context.user).orientation;
    flow.startCapture();
    window.setTimeout(endCalibration, 5000, oldOrientation);
}

var Quaternion = Argon.Cesium.Quaternion;

function endCalibration(oldOrientation) {
    flow.stopCapture();
    var newOrientation = app.context.getEntityPose(app.context.user).orientation;
    console.log(oldOrientation);
    console.log(newOrientation);
    var difference = new Quaternion();
    Quaternion.subtract(newOrientation, oldOrientation, difference);
    var theta = Quaternion.computeAngle(difference);
    var approxFov = theta * video.videoWidth / dx;
    console.log("dx = " + dx);
    console.log("theta = " + theta);
    console.log("fov = " + approxFov);
    button.disabled = false;
}