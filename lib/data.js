
(function() {

    engine.data.Flags = class {

        constructor(flags = []) {
            this._flags = new Set(flags);
        }

        get flags() {
            return this._flags.keys();
        }

        isSet(name) {
            return this._flags.has(name);
        }

        set(name, value = true) {
            if(value) {
                this._flags.add(name);
            } else {
                this._flags.delete(name);
            }
        }

    }

    engine.data.save = function(json) {
        const jsonString = JSON.stringify(json);
        localStorage.setItem("data", jsonString);
    }

    engine.data.load = function() {
        const jsonString = localStorage.getItem("data");
        return JSON.parse(jsonString);
    }

})();