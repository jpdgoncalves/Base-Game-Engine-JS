MH.scope(() => {

    const engine = MH.module("engine");
    const {CanvasLayers} = MH.module("engine.layers");
    const {Timer} = MH.module("engine.core");
    
    const enemy = {
        x: 200,
        y: 200
    };
    const player = {
        x: 100,
        y: 200
    };
    const layers = new CanvasLayers(document.body, "layers", 400, 400);
    const timer = new Timer(30);
    const canvas = layers.create("main");
    /**
     * @type {CanvasRenderingContext2D}
     */
    const context = canvas.getContext("2d");

    function update() {

    }

    function draw() {
        context.clearRect(0,0, canvas.width, canvas.height);
        context.beginPath();
        context.arc(player.x, player.y, 7, 0, Math.PI * 2);
        context.fillStyle = "#eeeeee";
        context.fill();
        context.beginPath();
        context.arc(enemy.x, enemy.y, 14, 0, Math.PI * 2);
        context.fillStyle = "#eeeeee";
        context.fill();
    }

    
    timer.callback = (deltatime) => {
        update();
        draw();
    }

    window.timer = timer;
    timer.start();

});