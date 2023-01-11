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
        this.startGameContainer = document.getElementById("startgame-container");
        this.buttonStartGame = this.startGameContainer.querySelector("#button-start");
        this.buttonStartGame.onclick = this.readyToStart.bind(this);

        /* Timer */
        this.gameTimer;
        this.gameTimeInitialSec;
        this.gameTimeRemainingSec;

        /* GameContainer */
        this.gameContainer = document.getElementById("game-container");

        this.buttonUp = this.gameContainer.querySelector("#button-up");
        this.buttonUp.onclick = this.move.bind(this, "up");
        this.buttonDown = this.gameContainer.querySelector("#button-down");
        this.buttonDown.onclick = this.move.bind(this, "down");
        this.buttonLeft = this.gameContainer.querySelector("#button-left");
        this.buttonLeft.onclick = this.move.bind(this, "left");
        this.buttonRight = this.gameContainer.querySelector("#button-right");
        this.buttonRight.onclick = this.move.bind(this, "right");

        this.buttonBackToStart = this.gameContainer.querySelector("#button-back-to-start");
        this.buttonBackToStart.onclick = this.backToStart.bind(this);

        this.buttonGuess = this.gameContainer.querySelector("#button-guess");
        this.buttonGuess.onclick = this.guess.bind(this);

        /* Endgame */
        this.endgameContainer = document.getElementById("endgame-container");
        this.endgameInfos = this.endgameContainer.querySelector("#button-endgame-infos");
        this.endgameModal = document.getElementById("endgame-modal");
        this.endgameMessageL1 = this.endgameModal.querySelector("#endgame-message-l1");
        this.endgameMessageL2 = this.endgameModal.querySelector("#endgame-message-l2");
        this.buttonRestart = this.endgameModal.querySelector("#button-restart");
        this.buttonRestart.onclick = this.restart.bind(this);

        /* Indices */
        this.hintsContainer = document.getElementById("hints-container");
        this.buttonHintAreaName = this.hintsContainer.querySelector("#button-hint-area-name");
        this.buttonHintAreaName.onclick = this.askAreaNameHint.bind(this);

        /* Création de classes */
        this.ui;
        this.hints = new Hints(this.clientId, this.hintsContainer);
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

    getClientId() {
        return this.clientId;
    }

    setImg(imgPath) {
        this.gameContainer.querySelector("#map-img").src = imgPath;
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
        this.endgameContainer.hidden = true;
        this.endgameInfos.disabled = true;

        // Afficher l'interface game-container + background + informations
        this.backgroundMap.setHidden(false);
        this.gameContainer.hidden = false;
        this.hints.setHidden(false);
        this.informations.setHidden(false);

        // Scroll au centre de l'image de fond
        this.backgroundMap.scrollTo();

        // Masquer l'overlay de démarrage
        this.startGameContainer.hidden = true;

        // Démarrage du timer
        this.gameTimer = setInterval(() => this.decreaseTimer(), 1000);
    }

    end(score, elapsedTime, winning_x, winning_y, winning_area_name) {
        // Stop du timer
        clearInterval(this.gameTimer);
        this.informations.updateTimerText(0);
        
        // Réduction de l'interface
        this.ui.setMinimizedGame();
        
        // Désactivation de l'interface de jeu
        this.setUiDisabled(true);
        this.hints.setUiDisabled(true);
        this.endgameContainer.hidden = false;
        this.endgameInfos.disabled = false;
        
        // Maj du message de fin
        this.endgameMessageL1.innerHTML = `Score final : ${score} (Temps restant : ${elapsedTime})`;
        this.endgameMessageL2.innerHTML = `La bonne réponse était : ${winning_x},${winning_y} (${winning_area_name})`;

        // Affichage du message de fin de partie
        this.showModal();

        // On laisse le joueur se déplacer sur la carte en fin de partie
        this.ui.enableDragscroll();

        // On affiche la cellule gagnante
        this.backgroundMap.setWinningCell(winning_x, winning_y);
    }

    move(direction) {
        sendRestMessage("PATCH", "/client/action/move", JSON.stringify({
            "client_id": this.clientId,
            "direction": direction
        }));
    }

    backToStart() {
        sendRestMessage("PATCH", "/client/action/back_to_start", JSON.stringify({
            "client_id": this.clientId
        }));
    }

    guess() {
        sendRestMessage("PATCH", "/client/action/guess", JSON.stringify({
            "client_id": this.clientId
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
        // Activation/Désactivation de la partie Map
        if (state) {
            this.buttonUp.setAttribute("disabled", "");
            this.buttonDown.setAttribute("disabled", "");
            this.buttonLeft.setAttribute("disabled", "");
            this.buttonRight.setAttribute("disabled", "");
        }
        else {
            this.buttonUp.removeAttribute("disabled");
            this.buttonDown.removeAttribute("disabled");
            this.buttonLeft.removeAttribute("disabled");
            this.buttonRight.removeAttribute("disabled");
        }
        this.backgroundMap.setDblClickDisabled(state);
        this.buttonBackToStart.disabled = state;
        this.buttonGuess.disabled = state;
        this.endgameInfos.disabled = state;
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
            this.ui = new Ui(this, this.gameContainer);
        }
    }

    /* Endgame */
    showModal() {
        // const endgameModal = new bootstrap.Modal(this.endgameModal);
        const endgameModal = new bootstrap.Modal(document.getElementById("endgame-modal"));
        endgameModal.show();
    }
}