'use strict';

export default class Ui {

    constructor(game, gameContainer) {
        this.game = game;
        this.gameContainer = gameContainer;
        this.rootCss = document.querySelector(':root');

        /* Configuration du zoom de l'aperçu de map */
        this.isGameContainerEnlarged = false;
        this.gameContainerWidthMin = getComputedStyle(this.rootCss).getPropertyValue('--game-container-width-min');
        this.gameContainerWidthMax = getComputedStyle(this.rootCss).getPropertyValue('--game-container-width-max');
        this.gameContainerButtonEnlarge = document.getElementById("button-game-container-enlarge");
        this.gameContainerButtonEnlarge.onclick = this.toggleEnlargedGame.bind(this);
        
        /* Configuration du Drag and Scroll de la page */
        // Désactivation du DragScroll quand on survol l'élément
        this.gameContainer.addEventListener('mouseover', this.disableDragscroll);

        // Activation du DragScroll quand on survol l'élément
        this.gameContainer.addEventListener('mouseout', this.enableDragscroll);
    }


    /*
    * Désactivation du DragScroll sur la page entière.
    */
    disableDragscroll() {
        document.body.classList.remove('dragscroll');
        dragscroll.reset();
    }

    /*
    * Activation du DragScroll sur la page entière.
    */
    enableDragscroll() {
        document.body.classList.add('dragscroll');
        dragscroll.reset();
    }

    /*
    * Agrandi la game-container pour que l'image de la map à localiser soit plus grande
    */
    toggleEnlargedGame() {
        if (this.isGameContainerEnlarged) {
            this.setMinimizedGame();
        } else {
            this.setMaximizedGame();
        }
    }

    setMaximizedGame() {
        this.rootCss.style.setProperty('--game-container-width-current', this.gameContainerWidthMax);
        this.gameContainerButtonEnlarge.classList.remove("bi-arrows-angle-expand")
        this.gameContainerButtonEnlarge.classList.add("bi-arrows-angle-contract")
        this.isGameContainerEnlarged = true;
    }
    
    setMinimizedGame() {
        this.rootCss.style.setProperty('--game-container-width-current', this.gameContainerWidthMin);
        this.gameContainerButtonEnlarge.classList.add("bi-arrows-angle-expand")
        this.gameContainerButtonEnlarge.classList.remove("bi-arrows-angle-contract")
        this.isGameContainerEnlarged = false;
    }

}