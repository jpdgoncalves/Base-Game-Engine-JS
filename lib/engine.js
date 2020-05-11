MH.scope(() => {



    const core = MH.create("engine.core");
    const constants = MH.create("engine.constants");

    constants.ENGINE_FOLDER = "../lib";
    constants.GAME_FOLDER = "../game";
    constants.GAME_FILE = `${constants.GAME_FOLDER}/game.js`;

    function engine_path(src) {
        return constants.ENGINE_FOLDER + "/" + src;
    }

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

    MH.import(
        engine_path("loaders.js"),
        engine_path("layers.js"),
        engine_path("sprites.js"),
        engine_path("events.js"),
        engine_path("data.js"),
        engine_path("audio.js"),
        engine_path("ui.js"),
        constants.GAME_FILE
    );



});