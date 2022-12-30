
export default class BackgroundMap {

    constructor(game, backgroundContainerId) {
        this.game = game;
        this.backgroundFilePath = "";
        this.backgroundHeight = 0;
        this.backgroundWidth = 0;
        this.backgroundContainer = document.querySelector(`#${backgroundContainerId}`);
        this.backgroundImage = this.backgroundContainer.querySelector("img");
        this.backgroundImage.onmousemove = this.onMouseMove.bind(this);
    }

    getBackgroundHeight() {
        return this.backgroundHeight;
    }

    getBackgroundWidth() {
        return this.backgroundWidth;
    }

    setBackground(bgPath, height, width) {
        this.backgroundFilePath = bgPath;
        this.backgroundHeight = height;
        this.backgroundWidth = width;
        this.backgroundImage.style.setProperty("background", `url('${this.backgroundFilePath}') no-repeat`);
        this.backgroundImage.style.setProperty("height", `${this.backgroundHeight}px`);
        this.backgroundImage.style.setProperty("width", `${this.backgroundWidth}px`);
    }

    onMouseMove(event) {
        this.game.setInfoCoordinates(event.offsetX, event.offsetY);
    }
}