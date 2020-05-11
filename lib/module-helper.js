
const MH = {};

/**
 * @type {Set<string>}
 */
MH.namespaces = new Set();
/**
 * @type {Map<string, boolean>}
 */
MH.scripts = new Map();
MH.modules = {};

/**
 * @param {string} namespace
 */
MH._populateNamespace = function(namespace) {
    let path, length, namespaceTracker;

    path = namespace.split(".");
    length = path.length;
    namespaceTracker = "";

    for(let i = 0; i < length; i++) {
        namespaceTracker += path[i];
        this.namespaces.add(namespaceTracker);
        namespaceTracker += ".";
    }
}

/**
 * @param {string} namespace
 */
MH._createModule = function(namespace) {
    let path, moduleTracker;

    path = namespace.split(".");
    moduleTracker = this.modules;

    for(let name of path) {
        if(! (name in moduleTracker)) {
            moduleTracker[name] = {};
        }

        moduleTracker = moduleTracker[name];
    }
}

/**
 * @param {string} src
 */
MH._insertScript = function(src) {
    const script = document.createElement("script");
    script.dataset.src = src;
    script.onload = this._onScriptLoad;
    script.async = false;
    script.src = src;

    document.head.appendChild(script);
    this.scripts.set(src, false);
}

/**
 * @param {HTMLScriptElement} target
 */
MH._onScriptLoad = (function({target}) {
    const src = target.dataset.src;
    this.scripts.set(src, true);
}).bind(MH);

/**
 * @param {string} namespace
 */
MH._exists = function(namespace) {
    return this.namespaces.has(namespace);
}


//
// Public Functions
//


/**
 * @param {string} namespace
 */
MH.create = function(namespace) {
    let path, module;

    if(this._exists(namespace)) {
        throw new Error(`Module '${namespace}' already exists`);
    }
    
    this._populateNamespace(namespace);
    this._createModule(namespace);

    return this.module(namespace);
}

/**
 * @param {string} namespace
 */
MH.module = function(namespace) {
    let path, module;

    if(!this._exists(namespace)) {
        throw new Error(`Module 'namespace' doesn't exist`);
    }

    path = namespace.split(".");
    module = this.modules;

    for(let name of path) {
        module = module[name];
    }

    return module;
}

/**
 * @param {string[]} srcs
 */
MH.import = function(...srcs) {
    for(let src of srcs) {
        this._insertScript(src);
    }
}

/**
 * @param {string[]} srcs
 */
MH.requires = function(...srcs) {
    for(let src of srcs) {
        if(!this.scripts.has(src)) {
            throw Error(`The script '${src}' was not imported`);
        }
        if(!this.scripts.get(src)) {
            throw Error(`The script '${src}' was not loaded yet. Check the order the scripts are being imported`);
        }
    }
}

/**
 * @param {{function(): void}} callback
 */
MH.scope = function(callback) {
    callback();
}