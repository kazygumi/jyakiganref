'use strict';

const CAM_PRV_ELM = document.getElementById('camera_preview');
let camPrvWidth = CAM_PRV_ELM.width;
let camPrvHeight = CAM_PRV_ELM.height;
const CAM_OVL_ELM = document.getElementById('camera_overlay');
const overlayCC = CAM_OVL_ELM.getContext('2d');

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
window.URL = window.URL || window.webkitURL || window.msURL || window.mozURL;

function cameraStart() {
    // check for camerasupport
    if (navigator.mediaDevices) {
        navigator.mediaDevices.getUserMedia({
            video: true
        }).then(gumSuccess).catch(gumFail);
    } else if (navigator.getUserMedia) {
        navigator.getUserMedia({
            video: true
        }, gumSuccess, gumFail);
    } else {
        alert("This demo depends on getUserMedia, which your browser does not seem to support. :(");
    }

    startVideo();
}

function cameraStop() {
    let stream = CAM_PRV_ELM.srcObject;

    if (stream) {
        let tracks = stream.getTracks();
        tracks.forEach(function (track) {
            track.stop();
        });

        CAM_PRV_ELM.srcObject = null;

        ctrack.stop();
        cancelRequestAnimFrame(drawLoop);
    }
}

/********** check and set up video/webcam **********/

function adjustVideoProportions() {
    // resize overlay and video if proportions are different
    // keep same height, just change width
    let proportion = CAM_PRV_ELM.videoWidth / CAM_PRV_ELM.videoHeight;
    camPrvWidth = Math.round(camPrvHeight * proportion);
    CAM_PRV_ELM.width = camPrvWidth;
    CAM_OVL_ELM.width = camPrvWidth;
}

function gumSuccess(stream) {
    // add camera stream if getUserMedia succeeded
    if ("srcObject" in CAM_PRV_ELM) {
        CAM_PRV_ELM.srcObject = stream;
    } else {
        CAM_PRV_ELM.src = (window.URL && window.URL.createObjectURL(stream));
    }
    CAM_PRV_ELM.onloadedmetadata = function () {
        adjustVideoProportions();
        //CAM_PRV_ELM.play();
    }
    CAM_PRV_ELM.onresize = function () {
        adjustVideoProportions();
        if (trackingStarted) {
            ctrack.stop();
            ctrack.reset();
            ctrack.start(CAM_PRV_ELM);
        }
    }
}

function gumFail() {
    alert("There was some problem trying to fetch video from your webcam. If you have a webcam, please make sure to accept when the browser asks for access to your webcam.");
}



/*********** setup of emotion detection *************/

// set eigenvector 9 and 11 to not be regularized. This is to better detect motion of the eyebrows
pModel.shapeModel.nonRegularizedVectors.push(9);
pModel.shapeModel.nonRegularizedVectors.push(11);

var ctrack = new clm.tracker({
    useWebGL: true
});
ctrack.init(pModel);
var trackingStarted = false;

function startVideo() {
    // start video
    CAM_PRV_ELM.play();
    // start tracking
    ctrack.start(CAM_PRV_ELM);
    trackingStarted = true;
    // start loop to draw face
    drawLoop();
}

function drawLoop() {
    requestAnimFrame(drawLoop);
    overlayCC.clearRect(0, 0, camPrvWidth, camPrvHeight);
    //psrElement.innerHTML = "score :" + ctrack.getScore().toFixed(4);
    if (ctrack.getCurrentPosition()) {
        ctrack.draw(CAM_OVL_ELM);
    }
    var cp = ctrack.getCurrentParameters();

    var er = ec.meanPredict(cp);
    if (er) {
        updateData(er);
        for (var i = 0; i < er.length; i++) {
            if (er[i].value > 0.4) {
                document.getElementById('icon' + (i + 1)).style.visibility = 'visible';
            } else {
                document.getElementById('icon' + (i + 1)).style.visibility = 'hidden';
            }
        }
    }
}

delete emotionModel['disgusted'];
delete emotionModel['fear'];
var ec = new emotionClassifier();
ec.init(emotionModel);
var emotionData = ec.getBlank();

/************ d3 code for barchart *****************/

var margin = {
        top: 20,
        right: 20,
        bottom: 10,
        left: 40
    },
    width = 400 - margin.left - margin.right,
    height = 100 - margin.top - margin.bottom;

var barWidth = 30;

var formatPercent = d3.format(".0%");

var x = d3.scale.linear()
    .domain([0, ec.getEmotions().length]).range([margin.left, width + margin.left]);

var y = d3.scale.linear()
    .domain([0, 1]).range([0, height]);

var svg = d3.select("#emotion_chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)

svg.selectAll("rect").
data(emotionData).
enter().
append("svg:rect").
attr("x", function (datum, index) {
    return x(index);
}).
attr("y", function (datum) {
    return height - y(datum.value);
}).
attr("height", function (datum) {
    return y(datum.value);
}).
attr("width", barWidth).
attr("fill", "#2d578b");

svg.selectAll("text.labels").
data(emotionData).
enter().
append("svg:text").
attr("x", function (datum, index) {
    return x(index) + barWidth;
}).
attr("y", function (datum) {
    return height - y(datum.value);
}).
attr("dx", -barWidth / 2).
attr("dy", "1.2em").
attr("text-anchor", "middle").
text(function (datum) {
    return datum.value;
}).
attr("fill", "white").
attr("class", "labels");

svg.selectAll("text.yAxis").
data(emotionData).
enter().append("svg:text").
attr("x", function (datum, index) {
    return x(index) + barWidth;
}).
attr("y", height).
attr("dx", -barWidth / 2).
attr("text-anchor", "middle").
attr("style", "font-size: 12").
text(function (datum) {
    return datum.emotion;
}).
attr("transform", "translate(0, 18)").
attr("class", "yAxis");

function updateData(data) {
    // update
    var rects = svg.selectAll("rect")
        .data(data)
        .attr("y", function (datum) {
            return height - y(datum.value);
        })
        .attr("height", function (datum) {
            return y(datum.value);
        });
    var texts = svg.selectAll("text.labels")
        .data(data)
        .attr("y", function (datum) {
            return height - y(datum.value);
        })
        .text(function (datum) {
            return datum.value.toFixed(1);
        });

    // enter
    rects.enter().append("svg:rect");
    texts.enter().append("svg:text");

    // exit
    rects.exit().remove();
    texts.exit().remove();
}
