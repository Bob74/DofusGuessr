

export default class Informations {

    constructor(informationsContainerId) {
        this.coordinateX = 0
        this.coordinateY = 0

        this.informationsContainer = document.querySelector(`#${informationsContainerId}`);
        this.coordinatesContainer = this.informationsContainer.querySelector("#coordinates");
    }

    setCoordinates(x, y) {
        this.coordinatesContainer.innerHTML = "x: " + x + "<br/>y: " + y;
    }
}