import sendRestMessage from "./rest.js";
import Hints from "./hints.js";


'use strict';

export default class Game {

    constructor(clientId, gameContainerId) {
        this.help = false;
        this.malus = 0;

        this.clientId = clientId;
        this.gameContainer = document.getElementById(gameContainerId);
        this.hints = new Hints(this.clientId, this.gameContainer, "hints-container");
        
        this.buttonUp = this.gameContainer.querySelector("#button-up");
        this.buttonUp.onclick = this.move.bind(this, "up");
        this.buttonDown = this.gameContainer.querySelector("#button-down");
        this.buttonDown.onclick = this.move.bind(this, "down");
        this.buttonLeft = this.gameContainer.querySelector("#button-left");
        this.buttonLeft.onclick = this.move.bind(this, "left");
        this.buttonRight = this.gameContainer.querySelector("#button-right");
        this.buttonRight.onclick = this.move.bind(this, "right");

        this.buttonGuess = this.gameContainer.querySelector("#button-guess");
        this.buttonGuess.onclick = this.guess.bind(this);

        this.buttonHint = this.gameContainer.querySelector("#button-hint");
        this.buttonHint.onclick = this.askAreaNameHint.bind(this);

        this.connectClient();
    }

    connectClient() {
        sendRestMessage("PATCH", "/client/action/ready", JSON.stringify({
            "client_id": this.clientId
        }));
    }

    updateImg(imgPath) {
        this.gameContainer.querySelector("#map-img").src = imgPath;
    }

    end(score, elapsedTime) {
        score = score - this.malus;
        if (score <= 500){
            score = 0
        }

        let endgameDiv = document.createElement("div");
        endgameDiv.setAttribute("id", "endgame-overlay");
        let p = document.createElement("p");
        p.innerHTML = `Score final : ${score} (${elapsedTime})`;

        endgameDiv.append(p);
        this.gameContainer.append(
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
        const fieldX = this.gameContainer.querySelector("#field-x").value;
        const fieldY = this.gameContainer.querySelector("#field-y").value;
        sendRestMessage("PATCH", "/client/action/guess", JSON.stringify({
            "client_id": this.clientId,
            "x": fieldX,
            "y": fieldY
        }));
    }

    askAreaNameHint() {
        this.hints.askAreaName();
        this.malus += 500;
    }

    showAreaNameHint(areaName) {
        this.hints.showAreaName(areaName);
    }

}