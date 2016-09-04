function httpRequest(url, method, payload) {
    var xhr = new XMLHttpRequest();

    var requestPromise = new Promise(function (resolve, reject) {
        try {
            xhr.open(method, url, true);
            xhr.responseType = 'text';
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.timeout = 2000;

            xhr.onreadystatechange = function () {
                if (this.readyState === this.DONE) {
                    if (this.status === 200 || (this.status === 0 && this.responseText)) {
                        resolve(this.responseText);
                    }
                    else if (this.status === 0) {
                        reject(this.statusText);
                    }
                    else {
                        var err = new Error(this.statusText);
                        err.status = this.status;
                        reject(err);
                    }
                    this.onreadystatechange = null;
                    xhr = undefined;
                }
            };
            xhr.send(JSON.stringify(payload));
        }
        catch (err) {
            reject(err);
        }
    });

    return requestPromise;
}
