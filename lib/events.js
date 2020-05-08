
engine.events.EventEmitter = class {

    constructor() {
        this.listenersMap = {};
    }

    emit(event, data) {
        const listeners = this.listenersMap[event];
        for(let listener of listeners) {
            listener(data);
        }
    }

    listen(event, listener) {
        if(! (event in this.listenersMap)) {
            this.listenersMap[event] = [];
        }
        this.listenersMap[event].push(listener);
    }

    clear(event) {
        if(!event) {
            this.listenersMap = {};
        } else {
            this.listenersMap[event] = [];
        }
    }

}

engine.events.GlobalEmitter = new (engine.events.EventEmitter)();