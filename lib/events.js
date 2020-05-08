
engine.core.scope(function() {

    class EventEmitter {

        constructor() {
            this.listenersMap = new Map();
        }
    
        emit(event, data) {
            const listeners = this.listenersMap.get(event) || [];
            for(let listener of listeners) {
                listener(data);
            }
        }
    
        listen(event, listener) {
            if(!this.listenersMap.has(event)) {
                this.listenersMap.set(event, []);
            }
            this.listenersMap.get(event).push(listener);
        }
    
        clear(event) {
            if(!event) {
                this.listenersMap.clear();
            } else {
                this.listenersMap.delete(event);
            }
        }
    
    }

    class Input {

        constructor(emitter, inputDevice = document) {
            this.keyBindings = new Map();
            this.emitter = emitter;
            this._keydown =  this._keydown.bind(this);
            this._keyup = this._keyup.bind(this);

            inputDevice.addEventListener("keydown", this._keydown);
            inputDevice.addEventListener("keyup", this._keyup);
        }

        bind(key, event) {
            this.keyBindings.set(key, event);
        }

        unbind(key) {
            this.keyBindings.delete(key);
        }

        /**
         * Disposes of the listeners that reference this instance.
         */
        destroy() {
            document.removeEventListener("keydown", this._keydown);
            document.removeEventListener("keyup", this._keyup);
        }

        _keydown({key, repeat}) {
            const event = this.keyBindings.get(key);
            if(event && !repeat) {
                this.emitter.emit(event, true);
            }
        }

        _keyup({key, repeat}) {
            const event = this.keyBindings.get(key);
            if(event) {
                this.emitter.emit(event, false);
            }
        }

    }

    engine.events.EventEmitter = EventEmitter
    engine.events.Input = Input;
    engine.events.GlobalEmitter = new EventEmitter();

});
