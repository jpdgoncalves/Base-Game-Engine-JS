MH.scope(() => {


    const data = MH.create("engine.data");

    data.Flags = class {

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
            if (value) {
                this._flags.add(name);
            } else {
                this._flags.delete(name);
            }
        }

    }

    data.saveInBrowser = function (json) {
        const jsonString = JSON.stringify(json);
        localStorage.setItem("data", jsonString);
    }

    data.loadFromBrowser = function () {
        const jsonString = localStorage.getItem("data");
        return JSON.parse(jsonString);
    }

    data.saveAsJSONP = function(json, fileName) {
        const a = document.createElement("a");
        const file = new Blob([json], {type: "text/plain"});
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
        setTimeout(
            () => {URL.revokeObjectURL(a.href);},
            1
        );
    }

});