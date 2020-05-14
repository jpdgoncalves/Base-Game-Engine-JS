MH.requires(
    "lib/events.js"
);

MH.scope(() => {

    const { EventEmitter } = MH.module("engine.events");

    const ui = MH.create("engine.ui");

    class UIManager extends EventEmitter {
        constructor() {
            this._idCounter = 0;
            /**
             * @type {Map<string, UIElement>}
             */
            this.children = new Map();
        }

        getId() {
            return (this._idCounter++).toString();
        }

        /**
         * 
         * @param {UIElement} uiElement 
         */
        append(uiElement) {
            const id = uiElement.id;
            if (this.children.has(id)) {
                throw new Error(`There is already an element with id '${id}'`);
            }
            this.children.set(id, uiElement);
        }

        /**
         * 
         * @param {UIElement} uiElement 
         */
        remove(uiElement) {
            this.children.delete(uiElement.id);
        }

        /**
         * 
         * @param {number} deltatime 
         */
        update(deltatime) {
            for (let uiElement of this.children.values()) {
                uiElement._update(deltatime);
            }
        }

        /**
         * 
         * @param {CanvasRenderingContext2D} context 
         */
        draw(context) {
            for (let uiElement of this.children.values()) {
                uiElement._draw(context);
            }
        }

        emit(event, data) {
            super.emit(event, data);

            if(
                event === "mousedown" ||
                event === "mouseup" ||
                event === "mousemove"
            ) {
                for(let child of this.children.values()) {
                    if (child._contains(event.x, event.y)) {
                        child.emit(event, data);
                    }
                }
            } else {
                for(let child of this.children.values()) {
                    child.emit(event, data);
                }
            }
        }

    }


    class UIElement extends EventEmitter {
        /**
         * 
         * @param {string} id 
         * @param {number} top 
         * @param {number} left 
         * @param {number} width 
         * @param {number} height 
         */
        constructor(id, top = 0, left = 0, width = 0, height = 0) {
            this.id = id;
            this.top = top;
            this.left = left;
            this.width = width;
            this.height = height;
            this.parentOffsetX = 0;
            this.parentOffsetY = 0;
            /**
             * @type {Map<string, UIElement>}
             */
            this.children = new Map();

        }

        get offsetX() {
            return this.parentOffsetX + this.left;
        }

        get offsetY() {
            return this.parentOffsetY + this.top;
        }

        /**
         * 
         * @param {UIElement} uiElement 
         */
        appendChild(uiElement) {
            const id = uiElement.id;
            if (this.children.has(id)) {
                throw new Error(`There is already an element with id '${id}' within element '${this.id}'`);
            }
            this.children.set(id, uiElement);
        }

        /**
         * 
         * @param {UIElement} uiElement 
         */
        removeChild(uiElement) {
            this.children.delete(uiElement.id);
        }

        /**
         * This method can be safely overriden
         * @param {number} deltatime 
         */
        update(deltatime) { }

        /**
         * This method can be safelly overriden
         * @param {CanvasRenderingContext2D} context 
         */
        draw(context) { }

        emit(event, data) {
            super.emit(event, data);

            if(
                event === "mousedown" ||
                event === "mouseup" ||
                event === "mousemove"
            ) {
                for(let child of this.children.values()) {
                    if (child._contains(event.x, event.y)) {
                        child.emit(event, data);
                    }
                }
            } else {
                for(let child of this.children.values()) {
                    child.emit(event, data);
                }
            }
        }

        /**
         * 
         * @param {number} deltatime 
         * @param {number} parentOffsetX 
         * @param {number} parentOffsetY 
         */
        _update(deltatime, parentOffsetX = 0, parentOffsetY = 0) {
            //Update offsets from the parent elements first
            this.parentOffsetX = parentOffsetX;
            this.parentOffsetY = parentOffsetY;

            //Call the user made update method
            this.update(deltatime);

            //Lastly update the child elements
            for (let uiElement of this.children.values) {
                uiElement._update(deltatime, this.offsetX, this.offsetY);
            }
        }

        /**
         * 
         * @param {CanvasRenderingContext2D} context 
         */
        _draw(context) {

            //Call the user made draw method
            this.draw(context);

            //Lastly update the child elements
            for (let uiElement of this.children.values) {
                uiElement._draw(context);
            }
        }

        /**
         * 
         * @param {number} x 
         * @param {number} y 
         */
        _contains(x, y) {
            return this.left <= x && this.left + this.width >= x
                && this.top <= y && this.top + this.height >= y;
        }

    }

    ui.UIManager = UIManager;
    ui.UIElement = UIElement;

});