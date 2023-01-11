'use strict';
import sendRestMessage from "./rest.js";


export default class BackgroundMap {

    constructor(game, backgroundContainerId) {
        this.game = game;
        this.backgroundFilePath = "";
        this.backgroundHeight = 0;
        this.backgroundWidth = 0;

        this.backgroundContainer = document.querySelector(`#${backgroundContainerId}`);
        this.backgroundGrid = this.backgroundContainer.querySelector("#background-grid");
        this.backgroundGridBody;
        this.backgroundImage = this.backgroundContainer.querySelector("#background-map");

        this.selectedCell;

        this.createGrid();
    }

    /*
    * Affiche ou masque le fond du jeu
    */
    setHidden(state) {
        this.backgroundContainer.hidden = state;
    }

    /*
    * Créé la grille de fond qui contient les coordonnées des cellules.
    */
    createGrid() {
        this.backgroundMinX = -91;
        this.backgroundMaxX = 43;
        this.backgroundMinY = -120;
        this.backgroundMaxY = 48;

        this.cellIconGuess = document.createElement('i');
        this.cellIconGuess.classList.add("bi-question-lg")
        this.cellIconGuess.classList.add("cell-icon")

        this.cellIconWin = document.createElement('i');
        this.cellIconWin.classList.add("bi-check-lg")
        this.cellIconWin.classList.add("cell-icon")

        this.backgroundGridBody = document.createElement("tbody");

        // Création des cellules de la grille
        for (let y = this.backgroundMinY; y <= this.backgroundMaxY; y++) {
            let column = this.backgroundGridBody.appendChild(document.createElement("tr"));
            for (let x = this.backgroundMinX; x <= this.backgroundMaxX; x++) {
                let cell = document.createElement("td");
                cell.id = `cellX${x}Y${y}`;
                cell.title = `${x}:${y}`;
                cell.setAttribute("cell-x", x);
                cell.setAttribute("cell-y", y);
                cell.classList.add("cell-base");
                cell.addEventListener("dblclick", e => this.onCellDblClicked(e));
                column.appendChild(cell);
            }
        }

        // Ajout de la grille aux conteneurs
        this.backgroundGrid.appendChild(this.backgroundGridBody);
        this.backgroundContainer.appendChild(this.backgroundGrid);
    }

    /*
    * Déplace la vue aux coordonnées fournies.
    * Si aucune coordonnée, se place au centre de l'image de fond.
    */
    scrollTo(top, left) {
        if (!top) {
            top = this.getBackgroundHeight() / 2;
        }
        if (!left) {
            left = this.getBackgroundWidth() / 2;
        }

        window.scroll({
            top: top,
            left: left,
            behavior: 'auto'
        });
    }

    /* Background image*/
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

    /* Cellules */
    onCellDblClicked(event) {
        const cellX = parseInt(event.target.getAttribute("cell-x"));
        const cellY = parseInt(event.target.getAttribute("cell-y"));

        // Envoi de l'information au back
        sendRestMessage("PATCH", "/client/action/update_guess", JSON.stringify({
            "client_id": this.game.getClientId(),
            "x": cellX,
            "y": cellY
        }));

        // Suppression du CSS de cellule précédente
        if (this.selectedCell) {
            this.selectedCell.classList.remove("cell-selected");
            this.selectedCell.removeChild(this.cellIconGuess);
        }
        
        // Stockage de la cellule selectionnée
        this.selectedCell = event.target;
        
        // Application du CSS
        this.selectedCell.classList.add("cell-selected");
        this.selectedCell.appendChild(this.cellIconGuess);
    }

    setDblClickDisabled(state) {
        // Active/Désactive le double click sur les cellules
        if (state) {
            this.backgroundGridBody.style.pointerEvents = "none";
        }
        else {
            
            this.backgroundGridBody.style.pointerEvents = "auto";
        }
    }

    setWinningCell(x, y) {
        const winningCell = this.backgroundGridBody.querySelector(`#cellX${x}Y${y}`)

        // Suppression du style si la cellule était sélectionnée
        winningCell.classList.remove("cell-selected");
        if (winningCell.contains(this.cellIconGuess)) {
            winningCell.removeChild(this.cellIconGuess);
        }

        // Application du style de cellule gagnante
        winningCell.classList.add("cell-winning");
        winningCell.appendChild(this.cellIconWin);

        // Scroll jusqu'à la cellule gagnante
        winningCell.scrollIntoView({behavior: "smooth", block: "center", inline: "center"})

        // Trace une ligne entre la cellule guessée et la gagnante
        // if (!this.selectedCell || this.selectedCell === winningCell) {
        //     return;
        // }

        // winningCell.getBoundingClientRect().left

        // const svg = document.createElement("svg");
        // svg.setAttribute("height", `${this.getBackgroundHeight()}`);
        // svg.setAttribute("width", `${this.getBackgroundWidth()}`);

        // const svgG = document.createElement("g");
        // svgG.setAttribute("fill", "none");
        // svgG.setAttribute("stroke", "black");
        // svgG.setAttribute("stroke-width", "4");

        // const svgPath = document.createElement("path");
        // svgPath.setAttribute("stroke-dasharray", "10,10");
        // svgPath.setAttribute("d", `M${winningCell.getBoundingClientRect().left} ${winningCell.getBoundingClientRect().top} ${this.selectedCell.getBoundingClientRect().left} ${this.selectedCell.getBoundingClientRect().top}`);



        // svgG.appendChild(svgPath);
        // svg.appendChild(svgG);
        // this.backgroundContainer.append(svg);

    }
}