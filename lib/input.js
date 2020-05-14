MH.scope(() => {

    const input = MH.create("engine.input");

    class Keyboard {
        /**
         * 
         * @param {HTMLCanvasElement} source 
         * @param {EventEmitter} emitter 
         */
        constructor(source, emitter) {
            this.source = source;
            this.emitter = emitter;
            /**
             * Map with the bindings between keyboard input and the event it should trigger.
             * @type {Map<string, string>}
             */
            this.bindings = new Map();
            this.KeyEventData = {
                name: "",
                down: false
            };

            this._keydown = this._keydown.bind(this);
            this._keyup = this._keyup.bind(this);
            this.source.addEventListener("keydown", this._keydown);
            this.source.addEventListener("keyup", this._keyup);
        }

        destroy() {
            this.source.removeEventListener("keydown", this._keydown);
            this.source.removeEventListener("keyup", this._keyup);
        }

        /**
         * 
         * @param {string} key 
         * @param {string} event 
         */
        bind(key, event) {
            if(this.bindings.has(key)) {
                throw new Error(`Key '${key}' is already mapped`);
            }

            this.bindings.set(key, event);
        }

        /**
         * 
         * @param {string} key 
         */
        unbind(key) {
            this.bindings.delete(key);
        }

        /**
         * 
         * @param {KeyboardEvent} event 
         */
        _keydown(event) {
            const key = event.key;
            const eventData = this.KeyEventData
            if(this.bindings.has(key) && !event.repeat) {
                const name = this.bindings.get(key);

                eventData.name = name;
                eventData.down = true;
                this.emitter.emit(name, eventData);
            }
        }

        /**
         * @param {KeyboardEvent} event
         */
        _keyup(event) {
            const key = event.key;
            const eventData = this.KeyEventData
            if(this.bindings.has(key)) {
                const name = this.bindings.get(key);

                eventData.name = name;
                eventData.down = false;
                this.emitter.emit(name, eventData);
            }
        }
    }

    class Mouse {
        /**
         * 
         * @param {HTMLCanvasElement} source 
         * @param {EventEmitter} emitter 
         */
        constructor(source, emitter) {
            this.source = source;
            this.emitter = emitter;
            this.MouseEventData = {
                x: 0,
                y: 0,
                left: false,
                right: false
            };

            this._mousedown = this._mousedown.bind(this);
            this._mouseup = this._mousedown.bind(this);
            this._mousemove = this._mousemove.bind(this);
            this.source.addEventListener("mousedown", this._mousedown);
            this.source.addEventListener("mouseup", this._mouseup);
            this.source.addEventListener("mousedown", this._mousedown);
        }

        destroy() {
            this.source.removeEventListener("mousedown", this._mousedown);
            this.source.removeEventListener("mouseup", this._mouseup);
            this.source.removeEventListener("mousedown", this._mousedown);
        }

        /**
         * 
         * @param {MouseEvent} event 
         */
        _mousedown(event) {
            const eventData = this._getEventData(event);
            this.emitter.emit("mousedown", eventData);
        }

        /**
         * 
         * @param {MouseEvent} event 
         */
        _mouseup(event) {
            const eventData = this._getEventData(event);
            this.emitter.emit("mouseup", eventData);
        }

        /**
         * 
         * @param {MouseEvent} event 
         */
        _mousemove(event) {
            const eventData = this._getEventData(event);
            this.emitter.emit("mousemove", eventData);
        }

        /**
         * 
         * @param {MouseEvent} event 
         */
        _getEventData(event) {
            const eventData = this.MouseEventData;
            const source = this.source;
            const {width, height} = event.target.getBoundingClientRect();

            eventData.x = Math.round(event.offsetX * source.width / width);
            eventData.y = Math.round(event.offsetY * source.height / height);
            eventData.left = !!(event.buttons && 1);
            eventData.right = !!(event.buttons && 2);

            return eventData;
        }
    }

    class Text {
        /**
         * 
         * @param {HTMLCanvasElement} source 
         * @param {EventEmitter} emitter 
         */
        constructor(source, emitter) {
            this.source = source;
            this.emitter = emitter;
            
            this._keydown = this._keydown.bind(this);
            this.source.addEventListener("keydown", this._keydown);
        }

        destroy() {
            this.source.removeEventListener("keydown", this._keydown);
        }

        /**
         * 
         * @param {KeyboardEvent} event 
         */
        _keydown(event) {
            this.emitter.emit("keydown", event.key);
        }
    }

    input.Keyboard = Keyboard;
    input.Mouse = Mouse;
    input.Text = Text;

});