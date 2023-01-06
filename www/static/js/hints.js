import sendRestMessage from "./rest.js";

'use strict';

export default class Hints {
    constructor(clientId, hintsContainer) {
        this.clientId = clientId;
        this.hintsContainer = hintsContainer;

        /* Indice AreaName : Afficher la zone de la map */
        this.areaNameEndpoint = "/client/hint/action/area"
        this.buttonHintAreaName = this.hintsContainer.querySelector("#button-hint-area-name");
        this.isAreaNameEnabled = false;
    }
    /*
    * Affiche ou masque la partie Indices
    */
    setHidden(state) {
        this.hintsContainer.hidden = state;
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
        const areaNameElement = this.hintsContainer.querySelector("#hint-area-name");
        areaNameElement.innerHTML = `Votre zone de départ est : ${areaName}`;
        areaNameElement.hidden = false;
    }

    setUiDisabled(state) {
        // Désactivation des boutons d'indices
        this.buttonHintAreaName.disabled = state;
    }

}