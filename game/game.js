MH.scope(() => {
    const {Timer} = MH.module("engine.core");

    const timer = new Timer(30);
    timer.callback = console.log;
    
    window.timer = timer;
});