MH.scope(() => {

    const core = MH.create("engine.core");
    const constants = MH.create("engine.constants");

    /**
     * Please note that this function will consider the script tag a temporary loader and then get rid of it.
     */
    core.injectJSON = function(json) {
        const currentScript = document.currentScript;

        if(!currentScript.inject) {
            throw Error("Unable to find inject function for", currentScript);
        }

        currentScript.inject(json);
        //Trying to do some clean up manually to avoid a potential memory leak from having a reference
        //to the resolve function of an solved promise
        currentScript.inject = undefined;
        document.head.removeChild(currentScript);

    };

    const readOnlyProxyHandler = {
        set: function() {
            throw new Error("[ReadOnlyInstance] This is a readonly object");
        }
    };
    core.readOnlyInstance = function(obj) {
        return new Proxy(obj, readOnlyProxyHandler);
    }

    core.HasReadOnly = class {

        constructor() {
            this.readOnlyInstance = core.readOnlyInstance(this);
        }

    }

    core.bindObjectFunctions = function(obj) {
        for(let key in obj) {
            let value = obj[key];
            if(typeof(value) === "function") {
                value = value.bind(obj);
                obj[key] = value;
            }
        }
    }

    //
    //Define constants
    //

    constants.GAME_CONTAINER_ID = "game";
    constants.LAYERS_CONTAINER_ID = "game-layers";
    constants.INDEX_TOP = "1000";
    constants.INDEX_BOTTOM = "-1000";

});



MH.scope(() => {

    const core = MH.module("engine.core");

    class Timer {

        constructor(fps) {
            this._fps = fps;
            this._interval = 1000 / fps;
            this.lastTick = 0;
            /**
             * @type {{function(deltatime: number)}}
             */
            this.callback = undefined;
            this.started = false;
        }

        get fps() {
            return this._fps;
        }

        set fps(value) {
            this._fps = value;
            this._interval = 1000 / value;
        }

        get interval() {
            return this._interval;
        }

        start() {
            console.log(`Starting timer. FPS:${this._fps}`);

            const tick = (timedelta) => {
                if(this.started) {
                    if(timedelta - this.lastTick >= this._interval) {
                        this.lastTick = timedelta;
                        this.callback(this._interval);
                    }
                    window.requestAnimationFrame(tick);
                }
            }

            this.started = true;
            window.requestAnimationFrame(tick);
        }

        stop() {
            console.log("Stopping timer");
            this.started = false;
        }

    }

    core.Timer = Timer;

});