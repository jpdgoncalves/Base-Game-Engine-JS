MH.scope(() => {

    const {MouseCaptureZone, EventEmitter} = MH.module("engine.events");
    const {gameContainer} = MH.module("engine.html");
    console.log(MouseCaptureZone);
    console.log(EventEmitter);

    const emitter = new EventEmitter();
    emitter.listen("mousedown", console.log);
    emitter.listen("mouseup", console.log);
    //emitter.listen("mousemove", console.log);

    document.body.appendChild(gameContainer);
    window.emitter = emitter;
    window.MouseCaptureZone = MouseCaptureZone;

});