MH.requires(
    "lib/engine.js",
    "lib/html.js"
);

MH.scope(() => {

    const {EVENTS_CONTAINER_ID, INDEX_TOP} = MH.module("engine.constants");
    const {readOnlyInstance} = MH.module("engine.core");
    const {
        createContainer,
        createKeepRatioCanvas,
        destroyElement,
        gameContainer
    } = MH.module("engine.html");

    const events = MH.create("engine.events");

    const EMPTY_SET = new Set();
    const SyntheticMouseEvent = {
        x: 0,
        y: 0,
        left: false,
        right: false
    };
    const ReadOnlyMouseEvent = readOnlyInstance(SyntheticMouseEvent);
    let MCZInitialized = false;

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

    class KeyboardInput {

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

        _keyup({key}) {
            const event = this.keyBindings.get(key);
            if(event) {
                this.emitter.emit(event, false);
            }
        }

    }

    const MouseCaptureZone = {

        /**
         * 
         * @param {number} width 
         * @param {number} height
         * @param {MouseEvent} emitter
         */
        init: function(width, height, emitter) {
            if(MCZInitialized) {
                return;
            }
            this.width = width;
            this.height = height;
            this.emitter = emitter;
            this.absoluteContainer = createContainer(`absolute-${EVENTS_CONTAINER_ID}`);
            this.relativeContainer = createContainer(`${EVENTS_CONTAINER_ID}`);
            this.mouseDetector = createKeepRatioCanvas(width, height);
            
            gameContainer.appendChild(this.absoluteContainer);
            this.absoluteContainer.appendChild(this.relativeContainer);
            this.relativeContainer.appendChild(this.mouseDetector);

            this.absoluteContainer.style.zIndex = INDEX_TOP;
            this.mouseDetector.addEventListener("mousedown", this.mouseDown);
            this.mouseDetector.addEventListener("mouseup", this.mouseUp);
            this.mouseDetector.addEventListener("mousemove", this.mouseMove);
            this.mouseDetector.resize();
            MCZInitialized = true;
        },

        destroy: function() {
            if(!MCZInitialized) {
                return;
            }
            destroyElement(this.absoluteContainer);
            this.mouseDetector.removeEventListener("mousedown", this.mouseDown);
            this.mouseDetector.removeEventListener("mouseup", this.mouseUp);
            this.mouseDetector.removeEventListener("mousemove", this.mouseMove);

            this.width = 0;
            this.height = 0;
            this.emitter = undefined;
            this.absoluteContainer = undefined;
            this.relativeContainer = undefined;
            this.mouseDetector = undefined;
            MCZInitialized = false;
        },

        /**
         * 
         * @param {MouseEvent} event 
         */
        mouseDown: function(event) {
            this._setEventData(event);
            this.emitter.emit("mousedown", ReadOnlyMouseEvent);
        },

        mouseUp: function(event) {
            this._setEventData(event);
            this.emitter.emit("mouseup", ReadOnlyMouseEvent);
        },

        mouseMove: function(event) {
            this._setEventData(event);
            this.emitter.emit("mousemove", ReadOnlyMouseEvent);
        },

        /**
         * 
         * @param {MouseEvent} event 
         */
        _setEventData: function(event) {
            const domRect = event.target.getBoundingClientRect();
            SyntheticMouseEvent.x = Math.round(event.offsetX * this.width / domRect.width);
            SyntheticMouseEvent.y = Math.round(event.offsetY * this.height / domRect.height);
            SyntheticMouseEvent.right = event.buttons & 1;
            SyntheticMouseEvent.left = event.buttons & 2;
        }

    };
    MouseCaptureZone.init = MouseCaptureZone.init.bind(MouseCaptureZone);
    MouseCaptureZone.destroy = MouseCaptureZone.destroy.bind(MouseCaptureZone);
    MouseCaptureZone.mouseUp = MouseCaptureZone.mouseUp.bind(MouseCaptureZone);
    MouseCaptureZone.mouseDown = MouseCaptureZone.mouseDown.bind(MouseCaptureZone);
    MouseCaptureZone.mouseMove = MouseCaptureZone.mouseMove.bind(MouseCaptureZone);
    MouseCaptureZone._setEventData = MouseCaptureZone._setEventData.bind(MouseCaptureZone);


    events.EventEmitter = EventEmitter;
    events.KeyboardInput = KeyboardInput;
    events.MouseCaptureZone = MouseCaptureZone;
    events.GlobalEmitter = new EventEmitter();

});