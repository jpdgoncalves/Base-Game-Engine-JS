MH.requires(
    "lib/core.js",
    "lib/html.js"
);

MH.scope(() => {

    const events = MH.create("engine.events");

    const EMPTY_SET = new Set();

    class EventEmitter {

        constructor() {
            /**
             * @type {Map<string, Set<function>>}
             */
            this.listenersMap = new Map();
        }
    
        emit(event, data) {
            const listeners = this.listenersMap.get(event) || EMPTY_SET;
            for(let listener of listeners) {
                listener(data);
            }
        }
    
        listen(event, listener) {
            if(!this.listenersMap.has(event)) {
                this.listenersMap.set(event, new Set());
            }
            this.listenersMap.get(event).add(listener);
        }

        unlisten(event, listener) {
            if(!this.listenersMap.has(event)) {
                return;
            }
            this.listenersMap.get(event).delete(listener);
        }
    
        clear(event) {
            if(!event) {
                this.listenersMap.clear();
            } else {
                this.listenersMap.get(event).clear();
            }
        }
    
    }

    class EventEmitterGroup extends EventEmitter {
        constructor() {
            /**
             * @type {EventEmitter[]}
             */
            this.group = [];
        }

        /**
         * 
         * @param {EventEmitter} emitter 
         */
        push(emitter) {
            this.group.push(emitter);
        }

        emit(event, data) {
            for(let emitter of this.group) {
                emitter.emit(event, data);
            }
            super.emit(event, data);
        }
    }

    events.EventEmitter = EventEmitter;
    events.EventEmitterGroup = EventEmitterGroup;

});