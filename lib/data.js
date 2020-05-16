MH.scope(() => {


    const data = MH.create("engine.data");

    class Flags {

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

    class Matrix {
        /**
         * 
         * @param {number} width 
         * @param {number} height 
         */
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.data = new Array(width * height);
        }

        /**
         * 
         * @param {function} callback 
         * @param {number} startX 
         * @param {number} startY 
         * @param {number} width 
         * @param {number} height 
         */
        forEachIn(callback, startX = 0, startY = 0, width = this.width, height = this.height) {
            for(let y = startY; y <= startY + height; y++) {
                for(let x = startX; x <= startX + width; x++) {
                    callback(this.get(x, y));
                }
            }
        }

        set(x, y, value) {
            const index = this.width * y + x;
            this.data[index] = value;
        }

        /**
         * 
         * @param {number} x 
         * @param {number} y 
         */
        get(x, y) {
            const index = this.width * y + x;
            return this.data[index];
        }

    }

    class Vector2 {

        constructor(x = 0, y = 0) {
            this.set(x, y);
        }

        /**
         * 
         * @param {number} x 
         * @param {number} y 
         */
        set(x, y) {
            this.x = x;
            this.y = y;
        }

        /**
         * 
         * @param {Vector2} param0 
         */
        add({x, y}) {
            this.x += x;
            this.y += y;
        }

    }

    data.Flags = Flags;
    data.Matrix = Matrix;
    data.Vector2 = Vector2;

});



MH.scope(() => {

    const data = MH.module("engine.data");

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