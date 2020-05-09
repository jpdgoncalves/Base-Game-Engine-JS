
engine.loaders.loadImage = function(src) {
    return new Promise(
        (resolve) => {
            const image = document.createElement("img");
            image.onload = () => {
                resolve(image);
            }
            image.src = src;
        }
    );
}

engine.loaders.loadAudio = function(src) {
    return new Promise(
        (resolve) => {
            const audio = new Audio(src);
            audio.oncanplaythrough = () => {
                resolve(audio);
            }
        }
    );
}

engine.loaders.loadJSONP = function(src) {
    return new Promise(
        (resolve) => {
            const JSONPLoader = document.createElement("script");
            JSONPLoader.inject = resolve;
            JSONPLoader.src = src;
            document.head.appendChild(JSONPLoader);
        }
    );
}

engine.loaders.loadFont = (function () {

    const SHELPER_ID = "font-style-helper";
    const LHELPER_ID = "font-loader-helper";
    let counter = 0;

    //Function to make the @font-face rule
    function makeFontFaceRule(srcsformats, name) {

        let fontFaceRule = "@font-face { src:";

        for(let i = 0; i < srcsformats.length; i+=2) {
            const src = srcsformats[i];
            const format = srcsformats[i+1];

            fontFaceRule += `url("${src}") format("${format}")`;
            fontFaceRule += i + 2 < srcsformats.length ? "," : ";";
        }

        fontFaceRule += `font-family: "${name}"`;
        fontFaceRule += "}";

        return fontFaceRule;
    }

    function checkHelpers() {
        if(!document.getElementById(SHELPER_ID)) {
            const style = document.createElement("style");
            const loader = document.createElement("div");

            style.id = SHELPER_ID;
            loader.id = LHELPER_ID;

            document.head.appendChild(style);
            document.body.appendChild(loader);
        }
    }

    function loadFont(srcsformats, name) {
        const fontFaceRule = makeFontFaceRule(srcsformats, name);

        //Make sure the helpers are present
        checkHelpers();

        const style = document.getElementById(SHELPER_ID);
        const loader = document.getElementById(LHELPER_ID);
        const forceLoad = document.createElement("span");

        forceLoad.style.fontFamily = name;

        style.innerHTML += fontFaceRule;
        loader.appendChild(forceLoad);

        return new Promise(function(resolve, reject) {
            setTimeout(resolve, 3000);
        });
    }

    return loadFont;

})();

engine.loaders.loadBufferMaker = async function(src) {
    const {loadImage} = engine.loaders;
    const {fromImage} = engine.sprites;
    
    const image = await loadImage(src);

    return fromImage(image);
}