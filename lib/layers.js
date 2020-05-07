
engine.layers.CanvasLayerManager = class {

    constructor(container, width, height, contextType="2d") {
        this.container = container;
        this.width = width;
        this.height = height;
        this.contextType = contextType;
        this.layers = {};

        //Need to bind this functions since they will be used as handlers in the container
        this._resizeHandler = this._resizeHandler.bind(this);
        this._resize = this._resize.bind(this);
        window.addEventListener("resize", this._resizeHandler);
    }

    createCanvasLayer(name, position = 0) {
        const layerObject = this._createLayerObject(name);
        const {canvas} = layerObject;

        this.layers[name] = layerObject;

        this._resize(canvas);
        this._insertCanvasIntoContainer(canvas, position);
    }

    deleteCanvasLayer(name) {
        const {canvas} = this.layers[name];
        
        this.container.removeChild(canvas);
        this.layers[name] = undefined;
    }

    getLayerContext(name) {
        return this.layers[name].context;
    }

    _createLayerObject(name) {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext(this.contextType);

        canvas.width = this.width;
        canvas.height = this.height;
        canvas.classList.add("layer");
        canvas.dataset.name = name;

        return {
            canvas,
            context
        };
    }

    _resizeHandler() {
        for(let key in this.layers) {
            const {canvas} = this.layers[key];
            this._resize(canvas);
        }
    }

    _resize(canvas) {
        const canvasRatio = canvas.width / canvas.height;
        const containerRatio = this.container.clientWidth / this.container.clientHeight;

        if(canvasRatio < containerRatio) {
            canvas.classList.add("fit-height");
            canvas.classList.remove("fit-width");
        } else {
            canvas.classList.add("fit-width");
            canvas.classList.remove("fit-height");
        }
    }

    _insertCanvasIntoContainer(canvas, position) {
        const container = this.container;
        const canvases = container.querySelectorAll("canvas.layers");

        if(canvases.length <= position) {
            container.appendChild(canvas);
        } else {
            container.insertBefore(canvas, canvases[position]);
        }
    }

}