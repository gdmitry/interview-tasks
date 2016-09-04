'use strict';

var endpoints = {
    baseUrl: 'http://127.0.0.1:3000',
    configUrl: baseUrl + '/api/v1/config',
    pointsUrl: baseURl + '/api/v1/points'
}

function httpGet(url) {
    return httpRequest(url, 'GET');
}

function getUpdateInterval(config) {
    return config.UPDATE_INTERVAL;
}

function delay(interval) {
    return new Promise(function (resolve) {
        setTimeout(resolve, interval);
    });
}

function drawPoints(points) {
    var canvas = document.getElementById('graph');
    var length = points.length;
    var i;

    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');
        // clear canvas
        canvas.width = canvas.width;
        ctx.beginPath();
        ctx.fillStyle = '#000';
        ctx.moveTo(0, 0);
        for (i = 0; i < length; i++) {
            ctx.lineTo(i, points[i]*15);
        }
        ctx.stroke();
    } else {
        throw new Error('Canvas is unsupported.');
    }
}

function updatePoints(interval) {
    var pointsUrl = endpoints.pointsUrl;
    return httpGet(pointsUrl)
        .then(drawPoints)
        .catch(console.error.bind(console))
        .then(delay.bind(undefined, interval))
        .then(updatePoints);
       
}

// start
httpGet(endpoints.configUrl)
    .then(getUpdateInterval)
    .then(updatePoints)
    .catch(console.error.bind(console));