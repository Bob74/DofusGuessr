import sendRestMessage from "./rest.js";

'use strict';

export default class Hints {
    constructor(clientId, hintsContainer) {
        this.clientId = clientId;
        this.hintsContainer = hintsContainer;

        /* Indice AreaName : Afficher la zone de la map */
        this.areaNameEndpoint = "/client/hint/action/area"
        this.buttonHintAreaName = this.hintsContainer.querySelector("#button-hint-area-name");
        this.isAreaNameAsked = false;
    }
    /*
    * Affiche ou masque la partie Indices
    */
    setHidden(state) {
        this.hintsContainer.hidden = state;
    }

    askAreaName() {
        if (!this.isAreaNameAsked) {
            if (confirm("Êtes-vous sûr de vouloir un indice sur la zone contre une pénalité de 500 points ?")) {
                sendRestMessage("PATCH", this.areaNameEndpoint, JSON.stringify({
                    "client_id": this.clientId
                }));
                this.buttonHintAreaName.disabled = true;
                this.isAreaNameAsked = true;
            }
        }
    }

    showAreaName(areaName) {
        alert(`Votre zone de départ est : ${areaName}`);
    }

    setUiDisabled(state) {
        // Désactivation des boutons d'indices
        this.buttonHintAreaName.disabled = state;
    }

}