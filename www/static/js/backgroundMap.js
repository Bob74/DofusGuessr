
export default class BackgroundMap {

    constructor(backgroundContainerId) {
        this.backgroundFilePath = "";
        this.backgroundHeight = 0;
        this.backgroundWidth = 0;
        this.backgroundContainer = document.querySelector(`#${backgroundContainerId}`);
        this.backgroundImage = this.backgroundContainer.querySelector("#background-img");
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
}