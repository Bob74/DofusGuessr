import sendRestMessage from "./rest.js";

'use strict';

export default class Hints {
    constructor(clientId, gameContainer, hintsContainerId) {
        this.clientId = clientId;
        this.gameContainer = gameContainer;
        this.hintsContainer = this.gameContainer.querySelector(`#${hintsContainerId}`);

        this.areaNameEndpoint = "/client/hint/action/area"

        this.buttonHint = this.gameContainer.querySelector("#button-hint-area");

        this.isAreaNameEnabled = false;
    }

    askAreaName() {
        if (!this.isAreaNameEnabled) {
            if (confirm("Êtes-vous sûr de vouloir un indice sur la zone contre une pénalité de 500 points ?")) {
                sendRestMessage("PATCH", this.areaNameEndpoint, JSON.stringify({
                    "client_id": this.clientId
                }));
                this.buttonHint.disabled = true;
                this.isAreaNameEnabled = true;
            }
        }
    }

    showAreaName(areaName) {
        const areaNameElement = this.gameContainer.querySelector("#hint");
        areaNameElement.innerHTML = `Votre zone de départ est : ${areaName}`;
        areaNameElement.hidden = false;
    }

}