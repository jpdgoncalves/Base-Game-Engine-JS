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

    /**
     * @param {string} id
     * @param {boolean} absolute
     */
    core.createContainer = function(id, absolute = false) {
        const container = document.createElement("div");
        const cssClass = absolute ? "absolute" : "relative";

        container.id = id;
        container.classList.add("container", cssClass);

        return container;
    }

    

});