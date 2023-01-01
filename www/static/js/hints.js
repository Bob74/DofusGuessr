import sendRestMessage from "./rest.js";

'use strict';

export default class Hints {
    constructor(clientId, sidebarContainer, hintsContainerId) {
        this.clientId = clientId;
        this.sidebarContainer = sidebarContainer;
        this.hintsContainer = this.sidebarContainer.querySelector(`#${hintsContainerId}`);

        /* Indice AreaName : Afficher la zone de la map */
        this.areaNameEndpoint = "/client/hint/action/area"
        this.buttonHintAreaName = this.sidebarContainer.querySelector("#button-hint-area-name");
        this.isAreaNameEnabled = false;
    }

    askAreaName() {
        if (!this.isAreaNameEnabled) {
            if (confirm("Êtes-vous sûr de vouloir un indice sur la zone contre une pénalité de 500 points ?")) {
                sendRestMessage("PATCH", this.areaNameEndpoint, JSON.stringify({
                    "client_id": this.clientId
                }));
                this.buttonHintAreaName.disabled = true;
                this.isAreaNameEnabled = true;
            }
        }
    }

    showAreaName(areaName) {
        const areaNameElement = this.sidebarContainer.querySelector("#hint-area-name");
        areaNameElement.innerHTML = `Votre zone de départ est : ${areaName}`;
        areaNameElement.hidden = false;
    }

    disableUi() {
        // Désactivation des boutons d'indices
        this.buttonHintAreaName.disabled = true;
    }

}