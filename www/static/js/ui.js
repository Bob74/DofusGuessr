'use strict';

export default class Ui {

    constructor(clientId) {
        this.clientId = clientId;

        this.guessContainer = document.getElementById('guess-container');
        this.guessContainer.addEventListener('mouseover', this.scrollableMouseOver);
        this.guessContainer.addEventListener('mouseout', this.scrollableMouseOut);
        
    }

    // Utilisé par la lib `dragscroll` pour permettre de bouger la map de fond
    scrollableMouseOver() {
        document.body.classList.remove('dragscroll');
        dragscroll.reset();
    }
    scrollableMouseOut() {
        document.body.classList.add('dragscroll');
        dragscroll.reset();
    }

}