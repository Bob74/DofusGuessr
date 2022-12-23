import sendRestMessage from "./rest.js";

'use strict';

export default class Game {

    constructor(clientId, gameContainerId) {
        this.gameContainerDiv = document.getElementById(gameContainerId);
        this.clientId = clientId;

        this.fieldX = this.gameContainerDiv.querySelector("#field_x");
        this.fieldY = this.gameContainerDiv.querySelector("#field_y");

        this.buttonUp = this.gameContainerDiv.querySelector("#button_up");
        this.buttonUp.onclick = this.move.bind(this, "up");
        this.buttonDown = this.gameContainerDiv.querySelector("#button_down");
        this.buttonDown.onclick = this.move.bind(this, "down");
        this.buttonLeft = this.gameContainerDiv.querySelector("#button_left");
        this.buttonLeft.onclick = this.move.bind(this, "left");
        this.buttonRight = this.gameContainerDiv.querySelector("#button_right");
        this.buttonRight.onclick = this.move.bind(this, "right");

        this.buttonGuess = this.gameContainerDiv.querySelector("#button_guess");
        this.buttonGuess.onclick = this.guess.bind(this);

        this.connectClient();
    }

    connectClient() {
        sendRestMessage("PATCH", "/client/action/ready", JSON.stringify({
            "client_id": this.clientId
        }));
    }

    updateImg(imgPath) {
        this.gameContainerDiv.querySelector("#map_img").src = imgPath;
    }

    end(score, elapsedTime) {
        let endgameDiv = document.createElement("div");
        endgameDiv.setAttribute("id", "endgame_overlay");
        let p = document.createElement("p");
        p.innerHTML = `Score final : ${score} (${elapsedTime})`;

        endgameDiv.append(p);
        this.gameContainerDiv.append(
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
        sendRestMessage("PATCH", "/client/action/guess", JSON.stringify({
            "client_id": this.clientId,
            "x": this.fieldX.value,
            "y": this.fieldY.value
        }));
    }
}