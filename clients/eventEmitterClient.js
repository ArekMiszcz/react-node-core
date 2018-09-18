import { EventEmitter } from "fbemitter";

class EventEmitterClient {
    constructor(args) {
        this.eventEmitter = new EventEmitter(args);
    }

    on(eventName, listener) {
        this.eventEmitter.addListener(eventName, listener);
    }

    removeEventListener(eventName, listener) {
        this.eventEmitter.removeListener(eventName, listener);
    }

    emit(event, payload, error = false) {
        this.eventEmitter.emit(event, payload, error);
    }

    getEventEmitter = () => this.eventEmitter;
}

module.exports = new EventEmitterClient();