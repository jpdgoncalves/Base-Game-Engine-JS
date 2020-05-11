MH.scope(() => {

    const sprites = MH.create("engine.sprites");

    sprites.createBuffer = function (image, x, y, width, height) {
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
    
    sprites.fromImage = function(image) {
        const createBuffer = sprites.createBuffer;
    
        return function makeBuffer(x, y, width, height) {
            return createBuffer(image, x, y, width, height);
        }
    }
    
    sprites.drawBuffer = function(context, buffer, x, y) {
        context.drawImage(
            buffer,
            x, y
        );
    }
    
    sprites.Animation = class {
    
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

});