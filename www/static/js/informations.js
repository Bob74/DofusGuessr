

export default class Informations {

    constructor(game, informationsContainerId) {
        this.coordinateX = 0
        this.coordinateY = 0

        this.informationsContainer = document.querySelector(`#${informationsContainerId}`);
        this.timerText = this.informationsContainer.querySelector("#informations-timer");
    }

    /*
    * Affiche ou masque le fond du jeu
    */
    setHidden(state) {
        this.informationsContainer.hidden = state;
    }

    updateTimerText(seconds) {
        this.timerText.innerHTML = this.secondsToTime(seconds);
    }

    secondsToTime(seconds) {
        const m = Math.floor(seconds % 3600 / 60).toString().padStart(2,'0');
        const s = Math.floor(seconds % 60).toString().padStart(2,'0');
        return `${m}:${s}`;
    }

}