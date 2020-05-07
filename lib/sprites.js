
engine.sprites.createBuffer = function (image, x, y, width, height) {
    const buffer = document.createElement("canvas");
    buffer.width = width;
    buffer.height = height;

    buffer.getContext("2d").drawImage(
        image,
        x, y, //Origin point in the image
        width, height, //Width and height of the image section we need
        0, 0, //Origin point of the buffer canvas
        width, height //Width and height of the buffer canvas
    );

    return buffer;
}

engine.sprites.drawBuffer = function(context, buffer, x, y) {
    context.drawImage(
        buffer,
        x, y
    );
}

engine.sprites.Animation = class {

    constructor(frames, duration) {
        this.frames = frames;
        this.accumulatedTime = 0;
        this.intervalBetweenFrames = duration / frames.length;
    }

    get currentFrame() {
        const index = Math.floor(this.accumulatedTime % this.intervalBetweenFrames);
        return this.frames[index];
    }

    update(deltatime) {
        this.accumulatedTime += deltatime;
    }

    draw(context, x, y) {
        context.drawImage(
            this.currentFrame,
            x, y
        );
    }

}