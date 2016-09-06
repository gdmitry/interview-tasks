'use strict';

(function (httpRequest) {
    var config = {
        endpoints: {
            configUrl: 'http://127.0.0.1:3000/api/v1/config',
            pointsUrl: 'http://127.0.0.1:3000/api/v1/points'
        },
        canvas: {
            width: 500,
            height: 300
        }
    };

    function CanvasController(id) {
        this.ctx = null;
        this.canvas = null;

        (function init(id) {
            this.canvas = document.getElementById(id);
            if (this.canvas.getContext) {
                this.ctx = this.canvas.getContext('2d');
                this.canvas.width = config.canvas.width;
                this.canvas.height = config.canvas.height;
            } else {
                throw new Error('Canvas is unsupported.');
            }
        }).call(this, id);
    };

    CanvasController.prototype.clear = function () {
        this.canvas.width = this.canvas.width;
    };

    CanvasController.prototype.drawPoints = function (points) {
        var length = points.length;
        var diffY = config.points.MAX - config.points.MIN;
        var ratioX = this.canvas.width / config.points.QTY;
        var ratioY = this.canvas.height / diffY;
        var i;

        this.clear();
        this.ctx.beginPath();
        this.ctx.fillStyle = '#000';
        this.ctx.moveTo(0, (points[i] + diffY / 2) * ratioY);
        for (i = 1; i < length; i++) {
            this.ctx.lineTo(i * ratioX, (points[i] + diffY / 2) * ratioY);
        }
        this.ctx.stroke();
    };

    function httpGet(url) {
        return httpRequest(url, 'GET')
            .then(JSON.parse);
    }

    function updateConfig(data) {
        config.points = data.POINTS;
        return config;
    }   

    function delay(interval) {
        return new Promise(function (resolve) {
            setTimeout(resolve, interval);
        });
    }

    function updatePoints() {
        var pointsUrl = config.endpoints.pointsUrl;
        var interval = config.points.UPDATE_INTERVAL;

        return httpGet(pointsUrl)
            .then(canvasController.drawPoints.bind(canvasController))
            .catch(console.error.bind(console))
            .then(delay.bind(undefined, interval))
            .then(updatePoints);

    }

    function startUpdate() {
        var configUrl = config.endpoints.configUrl;
        return httpGet(configUrl)
            .then(updateConfig)
            .then(updatePoints)
            .catch(console.error.bind(console));
    }

    // start
    var canvasController;
    try {
        canvasController = new CanvasController('graph');
        startUpdate();
    } catch (e) {
        console.error(e);
    }

})(httpRequest);
