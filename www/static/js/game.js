import sendRestMessage from "./rest.js";

'use strict';

export default class Game {

    constructor(clientId, gameContainerId) {
        this.help = false;
        this.malus = 0;
        this.gameContainerDiv = document.getElementById(gameContainerId);
        this.clientId = clientId;

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

        this.buttonHint = this.gameContainerDiv.querySelector("#button_hint");
        this.buttonHint.onclick = this.showHintMessagebox.bind(this);

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

        if (this.help){
            if (score <= 500){
                score = 0
            }else{
                score = score - this.malus;
            }
        }
        let endgameDiv = document.createElement("div");
        endgameDiv.setAttribute("id", "endgame_overlay");
        let p = document.createElement("p");
        p.innerHTML = `Score final : ${score} (${elapsedTime})`;

        endgameDiv.append(p);
        this.gameContainerDiv.append(
            endgameDiv
        );
    }

    showHint(zone){
        const area_name = this.gameContainerDiv.querySelector("#hint");
        area_name.hidden = false;
        area_name.innerHTML = `Votre zone de départ est : ${zone}`;
    }

    move(direction) {
        sendRestMessage("PATCH", "/client/action/move", JSON.stringify({
            "client_id": this.clientId,
            "direction": direction
        }));
    }

    guess() {
        const fieldX = this.gameContainerDiv.querySelector("#field_x").value;
        const fieldY = this.gameContainerDiv.querySelector("#field_y").value;
        sendRestMessage("PATCH", "/client/action/guess", JSON.stringify({
            "client_id": this.clientId,
            "x": fieldX,
            "y": fieldY
        }));
    }

    showHintMessagebox() {
        if (confirm("Etes-vous sûr de vouloir un indice sur la zone contre une pénalité de 500 points ?")) {
            sendRestMessage("PATCH", "/client/help/action/area", JSON.stringify({
                "client_id": this.clientId
            }));
            this.help = true;
            this.malus += 500;
        }
    }
}