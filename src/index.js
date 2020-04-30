class Main {
  constructor() {
    this.control = document.querySelector("#control");
    this.audio = document.querySelector("audio");
    this.isPlaying = false;

    this.audioContext = null;
    this.track = null;
    this.gain = null;
    this.panner = null;
    this.pannerInterval = 10;
    this.pannerTimer = null;
    this.maxDistance = 3;
    this.currentPos = 0;
    this.delta = 0.01;

    this.control.addEventListener("click", () => {
      if (this.isPlaying) {
        this.pause();
        this.updateControlTitle("Play");
      } else {
        this.play();
        this.updateControlTitle("Pause");
      }
      this.isPlaying = !this.isPlaying;
    });
    this.initAudio();
  }

  initAudio() {
    // Create audio context
    this.audioContext = new AudioContext();
    // create gain node

    this.gain = this.audioContext.createGain();
    this.gain.gain.value = 1;

    // create panner node
    this.panner = this.audioContext.createPanner();
    this.panner.setOrientation(0, 0, 0);
    this.panner.setPosition(0, 0, 0);

    // Create audio stream
    this.track = this.audioContext.createMediaElementSource(this.audio);

    this.track
      .connect(this.gain)
      .connect(this.panner)
      .connect(this.audioContext.destination);
  }

  play() {
    this.audio.play();
    this.pannerTimer = window.setInterval(
      this.changePosition.bind(this),
      this.pannerInterval
    );
  }
  pause() {
    this.audio.pause();
    window.clearInterval(this.pannerInterval);
  }
  updateControlTitle(title) {
    this.control.innerHTML = title;
  }
  changePosition() {
    this.currentPos += this.delta;
    if (this.currentPos >= this.maxDistance) {
      this.delta = -1 * this.delta;
    } else if (this.currentPos <= -1 * this.maxDistance) {
      this.delta = -1 * this.delta;
    }
    this.panner.setPosition(
      this.currentPos * 0.1,
      this.currentPos,
      this.currentPos
    );
  }
}

window.onload = () => {
  new Main();
};
