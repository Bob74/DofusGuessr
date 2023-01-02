'use strict';
import Ui from "./ui.js";
import Hints from "./hints.js";
import BackgroundMap from "./backgroundMap.js";
import Informations from "./informations.js";
import sendRestMessage from "./rest.js";


export default class Game {

    constructor(clientId) {
        this.clientId = clientId;
        this.backgroundFilePath = "";
        this.backgroundHeight = 0;
        this.backgroundWidth = 0;
        
        /* Sidebar */
        this.sidebarContainer = document.getElementById("sidebar");

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

        /* Endgame */
        this.endgameContainer = document.getElementById("endgame-container")
        this.endgameMessage = this.endgameContainer.querySelector("#endgame-message")
        this.buttonRestart = this.endgameContainer.querySelector("#button-restart")
        this.buttonRestart.onclick = this.restart.bind(this);

        /* Indices */
        this.buttonHintAreaName = this.sidebarContainer.querySelector("#button-hint-area-name");
        this.buttonHintAreaName.onclick = this.askAreaNameHint.bind(this);

        /* Création de classes */
        this.ui;
        this.hints = new Hints(this.clientId, this.sidebarContainer, "hints-container");
        this.backgroundMap = new BackgroundMap(this, "background-container");
        this.informations = new Informations("informations-container");

        /* Appel Rest pour la connexion du client */
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
        this.hints.disableUi();
        
        // Maj du message de fin
        this.endgameMessage.innerHTML = `Score final : ${score} (${elapsedTime})`;

        // Affichage du message de fin de partie        
        this.endgameContainer.hidden = false;
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

    restart() {
        document.location.reload();
    }

    /*
    * Désactive les inputs de l'interface de jeu
    */
    disableUi() {
        // Désactivation de la partie Map
        this.buttonUp.disabled = true;
        this.buttonDown.disabled = true;
        this.buttonLeft.disabled = true;
        this.buttonRight.disabled = true;
        this.buttonBackToStart.disabled = true;

        // Désactivation de la partie Guess
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
        if (!this.ui) {
            this.ui = new Ui(this);
        }
    }

    /* Guess */
    setCoordinates(x, y) {
        this.guessFieldX.value = x;
        this.guessFieldY.value = y;
    }
}