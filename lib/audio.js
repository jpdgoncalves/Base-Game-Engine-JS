
engine.core.scope(function() {

    class Music {

        /**
         * 
         * @param {HTMLAudioElement} audio 
         */
        constructor(audio) {
            this.audio = audio;
            this.switching = false;
        }

        get paused() {
            return this.audio.paused;
        }

        get volume() {
            return this.audio.volume;
        }

        set volume(value) {
            //This is to avoid errors from Javascript operations.
            //In certain cases subtracting number very close to 0 can result in errors.
            value = value >= 0 ? value : 0;

            this.audio.volume = value <= 1 ? value : 1;
        }

        stop() {
            this.pause();
            this.audio.currentTime = 0;
        }

        pause() {
            this.audio.pause();
        }

        play() {
            this.audio.play();
        }

        smoothPlay(seconds, changeFactor = 0.01) {
            if(!this.paused || this.switching) {
                return;
            }

            this.switching = true;
            this.volume = 0;
            this.play();

            const callback = () => {}
            const executor = this._createExecutor(seconds, changeFactor, 1, callback);

            return new Promise(executor);
        }

        smoothPause(seconds, changeFactor = 0.01) {
            if(this.paused || this.switching) {
                return;
            }

            this.switching = true;

            const callback = () => {
                this.pause();
            }
            const executor = this._createExecutor(seconds, -changeFactor, 0, callback);
            
            return new Promise(executor);
        }

        smoothStop(seconds, changeFactor = 0.01) {
            if(this.paused || this.switching) {
                return;
            }

            this.switching = true;

            const callback = () => {
                this.stop();
            }
            const executor = this._createExecutor(seconds, -changeFactor, 0, callback);

            return new Promise(executor);
        }

        /**
         * 
         * @param {number} seconds 
         * @param {number} changeFactor 
         * @param {number} targetVolume 
         * @param {Function} callback 
         */
        _createExecutor(seconds, changeFactor, targetVolume, callback) {
            const executor = (resolve, reject) => {
                if(this.volume === targetVolume) {
                    this.switching = false;
                    callback();
                    resolve();
                } else {
                    this.volume += changeFactor;
                    setTimeout(
                        executor,
                        this._getDelay(seconds, changeFactor),
                        resolve, reject
                    )
                }
            }

            return executor;
        }

        _getDelay(seconds, changeFactor) {
            changeFactor = changeFactor < 0 ? -changeFactor : changeFactor;
            return seconds * 1000 * changeFactor;
        }

    }

    engine.audio.Music = Music;

});