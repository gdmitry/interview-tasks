'use strict';

var config = {
    endpoints: {
        configUrl: 'http://127.0.0.1:3000/api/v1/config',
        pointsUrl: 'http://127.0.0.1:3000/api/v1/points'
    }
};

var Graphics = {
    ctx: null,
    canvas: null,
    init: function () {
        this.canvas = document.getElementById('graph');
        if (this.canvas.getContext) {
            this.ctx = this.canvas.getContext('2d');
        } else {
            throw new Error('Canvas is unsupported.');
        }
    },
    clear: function () {
        this.canvas.width = this.canvas.width;
    },
    drawPoints: function (points) {
        var length = points.length;
        var diffY = config.points.MAX - config.points.MIN;
        var ratioX = this.canvas.width / config.points.QTY;
        var ratioY = this.canvas.height / diffY;
        var ctx = this.ctx;
        var i;

        this.clear();
        ctx.beginPath();
        ctx.fillStyle = '#000';
        ctx.moveTo(0, (points[i] + diffY / 2) * ratioY);
        for (i = 1; i < length; i++) {
            ctx.lineTo(i * ratioX, (points[i] + diffY / 2) * ratioY);
        }
        ctx.stroke();
    }
};

function httpGet(url) {
    return httpRequest(url, 'GET')
        .then(JSON.parse);
}

function updateConfig(data) {
    config.points = data.POINTS;
    return config;
}

function getUpdateInterval(config) {
    return config.points.UPDATE_INTERVAL;
}

function delay(interval) {
    return new Promise(function (resolve) {
        setTimeout(resolve, interval);
    });
}

function updatePoints(interval) {
    var pointsUrl = config.endpoints.pointsUrl;
    return httpGet(pointsUrl)
        .then(Graphics.drawPoints.bind(Graphics))
        .catch(console.error.bind(console))
        .then(delay.bind(undefined, 2000))
        .then(updatePoints);

}

function startUpdate() {
    var configUrl = config.endpoints.configUrl;
    return httpGet(configUrl)
        .then(updateConfig)
        .then(getUpdateInterval)
        .then(updatePoints)
        .catch(console.error.bind(console));
}

// start
try {
    Graphics.init();
    startUpdate();
} catch (e) {
    console.error(e);
}