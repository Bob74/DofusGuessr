import sendRestMessage from "./rest.js";
import Hints from "./hints.js";


'use strict';
import BackgroundMap from "./backgroundMap.js";


export default class Game {

    constructor(clientId, sidebarId) {
        this.clientId = clientId;
        this.backgroundFilePath = "";
        this.backgroundHeight = 0;
        this.backgroundWidth = 0;

        this.sidebarContainer = document.getElementById(sidebarId);

        this.hints = new Hints(this.clientId, this.sidebarContainer, "hints-container");
        this.backgroundMap = new BackgroundMap("background-container");
        
        this.buttonUp = this.sidebarContainer.querySelector("#button-up");
        this.buttonUp.onclick = this.move.bind(this, "up");
        this.buttonDown = this.sidebarContainer.querySelector("#button-down");
        this.buttonDown.onclick = this.move.bind(this, "down");
        this.buttonLeft = this.sidebarContainer.querySelector("#button-left");
        this.buttonLeft.onclick = this.move.bind(this, "left");
        this.buttonRight = this.sidebarContainer.querySelector("#button-right");
        this.buttonRight.onclick = this.move.bind(this, "right");

        this.buttonGuess = this.sidebarContainer.querySelector("#button-guess");
        this.buttonGuess.onclick = this.guess.bind(this);

        this.buttonHintAreaName = this.sidebarContainer.querySelector("#button-hint-area-name");
        this.buttonHintAreaName.onclick = this.askAreaNameHint.bind(this);

        this.connectClient();
    }

    connectClient() {
        sendRestMessage("PATCH", "/client/action/ready", JSON.stringify({
            "client_id": this.clientId
        }));
    }

    setImg(imgPath) {
        this.sidebarContainer.querySelector("#map-img").src = imgPath;
    }

    end(score, elapsedTime) {
        let endgameDiv = document.createElement("div");
        endgameDiv.setAttribute("id", "endgame-overlay");
        let p = document.createElement("p");
        p.innerHTML = `Score final : ${score} (${elapsedTime})`;

        endgameDiv.append(p);
        this.sidebarContainer.append(
            endgameDiv
        );
    }

    move(direction) {
        sendRestMessage("PATCH", "/client/action/move", JSON.stringify({
            "client_id": this.clientId,
            "direction": direction
        }));
    }

    guess() {
        const fieldX = this.sidebarContainer.querySelector("#field-x").value;
        const fieldY = this.sidebarContainer.querySelector("#field-y").value;
        sendRestMessage("PATCH", "/client/action/guess", JSON.stringify({
            "client_id": this.clientId,
            "x": fieldX,
            "y": fieldY
        }));
    }

    /* Indices */
    askAreaNameHint() {
        this.hints.askAreaName();
    }

    showAreaNameHint(areaName) {
        this.hints.showAreaName(areaName);
    }

    /* Background Map */
    getBackgroundHeight() {
        return this.backgroundMap.getBackgroundHeight()
    }

    getBackgroundWidth() {
        return this.backgroundMap.getBackgroundWidth();
    }

    setBackground(bgPath, height, width) {
        this.backgroundMap.setBackground(bgPath, height, width);
    }

}