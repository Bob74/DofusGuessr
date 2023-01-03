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

        
        /* Start screen */
        this.gameStartContainer = document.getElementById("gamestart-container");
        this.buttonStartGame = this.gameStartContainer.querySelector("#button-start");
        this.buttonStartGame.onclick = this.readyToStart.bind(this);

        /* Timer */
        this.gameTimer;
        this.gameTimeInitialSec;
        this.gameTimeRemainingSec;

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
        this.informations = new Informations(this, "informations-container");

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

    readyToStart() {
        sendRestMessage("PATCH", "/client/action/start", JSON.stringify({
            "client_id": this.clientId
        }));
    }

    start() {
        // Enable UI buttons
        this.setUiDisabled(false);
        this.hints.setUiDisabled(false);

        // Afficher l'interface sidebar + background + informations
        this.backgroundMap.setHidden(false);
        this.sidebarContainer.hidden = false;
        this.informations.setHidden(false);

        // Scroll au centre de l'image de fond
        this.backgroundMap.scrollToMiddle();

        // Masquer l'overlay de démarrage
        this.gameStartContainer.hidden = true;

        // Démarrage du timer
        this.gameTimer = setInterval(() => this.decreaseTimer(), 1000);
    }

    end(score, elapsedTime) {
        // Stop du timer
        clearInterval(this.gameTimer);
        this.informations.updateTimerText(0);
                
        // Désactivation de l'interface de jeu
        this.setUiDisabled(true);
        this.hints.setUiDisabled(true);
        
        // Maj du message de fin
        this.endgameMessage.innerHTML = `Score final : ${score} (Temps restant : ${elapsedTime})`;

        // Affichage du message de fin de partie        
        this.endgameContainer.hidden = false;

        // On laisse le joueur se déplacer sur la carte en fin de partie
        this.ui.enableDragscroll();

        // Application du style CSS à la case de la bonne réponse
        // todo
        
        // Scroll jusqu'aux coordonnées de la bonne réponse
        // todo
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

    /* Timer */
    setInitialGameTime(seconds) {
        this.gameTimeInitialSec = seconds;
        this.gameTimeRemainingSec = seconds;
    }

    decreaseTimer() {
        this.gameTimeRemainingSec--;
        if (this.gameTimeRemainingSec <= 0) {
            // Timer arrivé à la fin, mais c'est le back qui doit indiquer la fin de partie
            this.informations.updateTimerText(0);
        }
        this.informations.updateTimerText(this.gameTimeRemainingSec);
    }

    /*
    * Désactive les inputs de l'interface de jeu
    */
    setUiDisabled(state) {
        // Désactivation de la partie Map
        this.buttonUp.disabled = state;
        this.buttonDown.disabled = state;
        this.buttonLeft.disabled = state;
        this.buttonRight.disabled = state;
        this.buttonBackToStart.disabled = state;

        // Désactivation de la partie Guess
        this.guessFieldX.disabled = state;
        this.guessFieldY.disabled = state;
        this.buttonGuess.disabled = state;
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