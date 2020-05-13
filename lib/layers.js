MH.requires(
    "lib/engine.js",
    "lib/html.js"
);

MH.scope(() => {

    const {LAYERS_CONTAINER_ID} = MH.module("engine.constants");
    const {
        createContainer,
        destroyElement,
        createKeepRatioCanvas,
        gameContainer
    } = MH.module("engine.html");

    const layers = MH.create("engine.layers");

    class CanvasLayerManager {

        constructor(width, height, contextType = "2d") {
            this.container = createContainer(LAYERS_CONTAINER_ID);
            this.width = width;
            this.height = height;
            this.contextType = contextType;
            this.layers = {};

            //Attach container to game container
            const absoluteContainer = createContainer(`absolute-${LAYERS_CONTAINER_ID}`, true);
            absoluteContainer.appendChild(this.container);
            gameContainer.appendChild(absoluteContainer);
        }

        createLayer(name, position = 0) {
            const layerObject = this._createLayerObject(name);
            const { canvas } = layerObject;

            this.layers[name] = layerObject;
            this._insertCanvasIntoContainer(canvas, position);
            //Call the resize function to fit the canvas into the container;
            canvas.resize();
        }

        deleteLayer(name) {
            const { canvas } = this.layers[name];

            destroyElement(canvas);
            this.layers[name] = undefined;
        }

        getCanvas(name) {
            return this.layers[name].canvas;
        }

        getLayerContext(name) {
            return this.layers[name].context;
        }

        _createLayerObject(name) {
            const canvas = createKeepRatioCanvas(this.width, this.height)
            const context = canvas.getContext(this.contextType);

            canvas.classList.add("layer");
            canvas.dataset.name = name;

            return {
                canvas,
                context
            };
        }

        _insertCanvasIntoContainer(canvas, position) {
            const container = this.container;
            const canvases = container.querySelectorAll("canvas.layers");

            if (canvases.length <= position) {
                container.appendChild(canvas);
            } else {
                container.insertBefore(canvas, canvases[position]);
            }
        }

    }

    layers.CanvasLayerManager = CanvasLayerManager;

});