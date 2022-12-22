import sendRestMessage from "./rest.js";

'use strict';

export default class Game {

    constructor(clientId, gameContainerId) {
        this.gameContainerDiv = document.getElementById(gameContainerId);
        this.clientId = clientId;

        this.fieldX = this.gameContainerDiv.querySelector("#field_x");
        this.fieldY = this.gameContainerDiv.querySelector("#field_y");
        this.buttonGuess = this.gameContainerDiv.querySelector("#button_guess");
        this.buttonGuess.onclick = this.doGuess.bind(this);
    }

    doGuess() {
        sendRestMessage("PATCH", "/client/action/guess", JSON.stringify({
            "client_id": this.clientId,
            "x": this.fieldX.value,
            "y": this.fieldY.value
        }));
    }

    doEnd(score, elapsedTime) {
        let endgameDiv = document.createElement("div");
        endgameDiv.setAttribute("id", "endgame_overlay");
        let p = document.createElement("p");
        p.innerHTML = `Score final : ${score} (${elapsedTime})`;

        endgameDiv.append(p);
        this.gameContainerDiv.append(
            endgameDiv
        );
    }
}