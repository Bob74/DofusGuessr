
export default class BackgroundMap {

    constructor(game, backgroundContainerId) {
        this.game = game;
        this.backgroundFilePath = "";
        this.backgroundHeight = 0;
        this.backgroundWidth = 0;

        this.backgroundContainer = document.querySelector(`#${backgroundContainerId}`);
        this.backgroundGrid = this.backgroundContainer.querySelector("#background-grid");
        this.backgroundImage = this.backgroundContainer.querySelector("#background-map");

        this.selectedCell;

        this.createGrid();
    }

    /*
    * Créé la grille de fond qui contient les coordonnées des cellules.
    */
    createGrid() {
        this.backgroundMinX = -91;
        this.backgroundMaxX = 43;
        this.backgroundMinY = -120;
        this.backgroundMaxY = 48;

        this.backgroundGridBody = document.createElement("tbody");

        for (let y = this.backgroundMinY; y <= this.backgroundMaxY; y++) {
            let column = this.backgroundGridBody.appendChild(document.createElement("tr"));
            for (let x = this.backgroundMinX; x <= this.backgroundMaxX; x++) {
                let cell = document.createElement("td");
                cell.title = `${x}:${y}`;
                cell.setAttribute("cell-x", x);
                cell.setAttribute("cell-y", y);
                cell.addEventListener("dblclick", e => this.onCellDblClicked(e));
                column.appendChild(cell);
            }
        }

        this.backgroundGrid.appendChild(this.backgroundGridBody);
        this.backgroundContainer.appendChild(this.backgroundGrid);
    }

    /*
    * Créé l'image de fond.
    */
    setBackground(bgPath, height, width) {
        this.backgroundFilePath = bgPath;
        this.backgroundHeight = height;
        this.backgroundWidth = width;
        this.backgroundImage.style.setProperty("background", `url('${this.backgroundFilePath}') no-repeat`);
        this.backgroundImage.style.setProperty("height", `${this.backgroundHeight}px`);
        this.backgroundImage.style.setProperty("width", `${this.backgroundWidth}px`);

        this.backgroundGrid.style.setProperty("height", `${this.backgroundHeight}px`);
        this.backgroundGrid.style.setProperty("width", `${this.backgroundWidth}px`);
    }

    getBackgroundHeight() {
        return this.backgroundHeight;
    }

    getBackgroundWidth() {
        return this.backgroundWidth;
    }

    onCellDblClicked(event) {
        // Suppression du CSS de cellule selectionnée
        if (this.selectedCell) {
            this.selectedCell.classList.remove("selected-cell");
            this.selectedCell.innerHTML = "";
        }
        
        // Stockage de la cellule selectionnée
        this.selectedCell = event.target;
        
        // Application du CSS
        this.selectedCell.classList.add("selected-cell");
        this.selectedCell.innerHTML = "X";

        // Ecriture des coordonnées dans les inputs
        this.game.setCoordinates(
            event.target.getAttribute("cell-x"),
            event.target.getAttribute("cell-y")
        );
    }
}