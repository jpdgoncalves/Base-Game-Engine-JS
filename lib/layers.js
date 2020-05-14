MH.requires(
    "lib/engine.js",
    "lib/html.js"
);

MH.scope(() => {

    const {
        createSubContainer,
        createKeepRatioCanvas,
        destroyElement
    } = MH.module("engine.html");

    const layers = MH.create("engine.layers");

    class CanvasLayers {

        /**
         * 
         * @param {HTMLElement} container 
         * @param {string} name 
         * @param {number} width 
         * @param {number} height 
         */
        constructor(container, name, width, height) {
            this.width = width;
            this.height = height;
            this.name = name;
            this.parentContainer = container;
            /**
             * @type {HTMLDivElement}
             */
            this.absoluteContainer = createSubContainer(name);
            /**
             * @type {HTMLDivElement}
             */
            this.layerContainer = this.absoluteContainer.firstChild;
            /**
             * @type {Map<string, HTMLCanvasElement>}
             */
            this.layers = new Map();

            this.parentContainer.appendChild(this.absoluteContainer);
        }

        destroy() {
            destroyElement(this.absoluteContainer);
        }

        /**
         * 
         * @param {string} name 
         * @param {number} position 
         */
        create(name, position = 0) {
            if(this.layers.has(name)) {
                throw new Error(`The layer '${name}' already exists`);
            }

            /**
             * @type {HTMLCanvasElement}
             */
            const canvas = createKeepRatioCanvas(this.width, this.height);
            canvas.dataset.name = name;
            
            this.layers.set(name, canvas);
            if(this.layerContainer.children.length <= position) {
                this.layerContainer.appendChild(canvas);
            } else {
                this.layerContainer.insertBefore(canvas, this.layerContainer.children[position]);
            }

            return canvas;
        }

        /**
         * 
         * @param {string} name 
         */
        get(name) {
            if(!this.layers.has(name)) {
                throw new Error(`There is no layer named '${name}'`);
            }

            return this.layers.get(name);
        }

        delete(name) {
            const canvas = this.get(name);

            this.layers.delete(name);
            destroyElement(canvas);
        }

    }

    layers.CanvasLayers = CanvasLayers;

});