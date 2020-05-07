

//
//Bootstrap the engine core
//

(function () {
    let engine, core, constants;

    const NSProxyHandler = {
        get: function (obj, key) {
            if (!(key in obj)) {
                throw new Error(`[NSProxy] property ${key} not defined`);
            }

            return obj[key];

        },


        set: function (obj, key, value) {
            if (key in obj) {
                throw new Error(`[NSProxy] property ${key} already defined`);
            }

            obj[key] = value;
        }
    };


    class Namespace {

        constructor() {
            return new Proxy({}, NSProxyHandler);
        }

    }



    engine = new Namespace();
    core = new Namespace();
    constants = new Namespace();
    core.Namespace = Namespace;


    //
    //Define core functions
    //

    core.sourceToNamespace = function(source) {
        return source.replace(".js", "").split("/");
    }

    core.createNamespaceMap = function(sources) {

        for(let source of sources) {
            const namespace = core.sourceToNamespace(source);
            let currentNamespace = engine;

            for(let name of namespace) {

                try {
                    currentNamespace[name] = new Namespace();
                } catch (error) {
                    console.log(`[createNamespaceMap] ${name} already defined`);
                } finally {
                    currentNamespace = currentNamespace[name];
                }
            }
            
        }
    }

    core.loadScript = function(source) {
        const script = document.createElement("script");
        script.src = source;
        //Ensure the execution order of the scripts
        script.async = false;
        document.head.appendChild(script);
    }

    core.loadModules = function(...sources) {
        core.createNamespaceMap(sources);

        for(let source of sources) {
            core.loadScript(`${constants.ENGINE_FOLDER}/${source}`);
        }
    }

    core.loadGame = function() {
        core.loadScript(constants.GAME_FILE);
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

    //
    // Setup base engine
    //

    engine.core = core;
    engine.constants = constants;
    window.engine = engine;

})();

//
//Setup constants
//
engine.constants.ENGINE_FOLDER = "../lib";
engine.constants.GAME_FOLDER = "../game";
engine.constants.GAME_FILE = `${engine.constants.GAME_FOLDER}/game.js`;

//
//Load engine modules
//
engine.core.loadModules(
    "loaders.js",
    "layers.js",
    "sprites.js"
);

//
//Load game
//
engine.core.loadGame();