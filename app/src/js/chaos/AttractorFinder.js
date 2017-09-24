let AttractorSnapshot = require('./AttractorSnapshot');

class AttractorFinder {
    constructor(onStatus, onComplete, onCancel) {
        this._onStatus = onStatus;
        this._onComplete = onComplete;
        this._onCancel = onCancel;
    }

    _initializeWorker() {
        if (this._worker) {
            this._worker.terminate();
        }
        this._worker = new Worker('js/finder.js');
        this._worker.addEventListener('message', e => {
            const data = e.data;
            switch(data.event) {
                case 'status':
                    if (this._onStatus) {
                        this._onStatus(e.data.status)
                    }
                    break;

                case 'complete':
                    if (this._onComplete) {
                        this._onComplete(data);
                    }
                    break;
            }
        });
    }

    start(configuration, viewport, snapshot) {
        this._initializeWorker();
        this._worker.postMessage({
            action: 'start',
            configuration: configuration.encode(),
            viewport,
            snapshot: snapshot && snapshot.encode()
        });
    }

    cancel() {
        if (this._onCancel) {
            this._onCancel();
        }
        if (this._worker) {
            this._worker.terminate();
        }
        this._worker = null;
    }
}

module.exports = AttractorFinder;