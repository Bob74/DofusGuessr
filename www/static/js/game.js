'use strict';
import BackgroundMap from "./backgroundMap.js";
import Hints from "./hints.js";
import Informations from "./informations.js";
import sendRestMessage from "./rest.js";


export default class Game {

    constructor(clientId, sidebarId) {
        this.clientId = clientId;
        this.backgroundFilePath = "";
        this.backgroundHeight = 0;
        this.backgroundWidth = 0;

        this.sidebarContainer = document.getElementById(sidebarId);

        this.hints = new Hints(this.clientId, this.sidebarContainer, "hints-container");
        this.backgroundMap = new BackgroundMap(this, "background-container");
        this.informations = new Informations("informations-container");
        
        this.buttonUp = this.sidebarContainer.querySelector("#button-up");
        this.buttonUp.onclick = this.move.bind(this, "up");
        this.buttonDown = this.sidebarContainer.querySelector("#button-down");
        this.buttonDown.onclick = this.move.bind(this, "down");
        this.buttonLeft = this.sidebarContainer.querySelector("#button-left");
        this.buttonLeft.onclick = this.move.bind(this, "left");
        this.buttonRight = this.sidebarContainer.querySelector("#button-right");
        this.buttonRight.onclick = this.move.bind(this, "right");

        this.buttonBackToStart = this.sidebarContainer.querySelector("#button-back-to-start");
        this.buttonBackToStart.onclick = this.backToStart.bind(this);


        this.guessFieldX = this.sidebarContainer.querySelector("#guess-x-input");
        this.guessFieldY = this.sidebarContainer.querySelector("#guess-y-input");
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
        // Désactivation de l'interface de jeu
        this.disableUi();
        
        // Ajout de l'overlay endgame
        let endgameDiv = document.createElement("div");
        endgameDiv.setAttribute("id", "endgame-overlay");
        let p = document.createElement("p");
        p.innerHTML = `Score final : ${score} (${elapsedTime})`;

        endgameDiv.append(p);
        document.body.append(
            endgameDiv
        );
    }

    move(direction) {
        sendRestMessage("PATCH", "/client/action/move", JSON.stringify({
            "client_id": this.clientId,
            "direction": direction
        }));
    }

    backToStart() {
        sendRestMessage("PATCH", "/client/action/back-to-start", JSON.stringify({
            "client_id": this.clientId
        }));
    }

    guess() {
        sendRestMessage("PATCH", "/client/action/guess", JSON.stringify({
            "client_id": this.clientId,
            "x": this.guessFieldX.value,
            "y": this.guessFieldY.value
        }));
    }

    disableUi() {
        // Désactivation des inputs
        this.buttonUp.disabled = true;
        this.buttonDown.disabled = true;
        this.buttonLeft.disabled = true;
        this.buttonRight.disabled = true;
        this.buttonBackToStart.disabled = true;

        this.guessFieldX.disabled = true;
        this.guessFieldY.disabled = true;
        this.buttonGuess.disabled = true;
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

    /* Guess */
    setCoordinates(x, y) {
        this.guessFieldX.value = x;
        this.guessFieldY.value = y;
    }
}