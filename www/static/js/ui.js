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
        // this.gameContainer.addEventListener('mouseover', this.disableDragscroll);

        // Activation du DragScroll quand on survol l'élément
        // this.gameContainer.addEventListener('mouseout', this.enableDragscroll);

        let pos = { top: 0, left: 0, x: 0, y: 0 };


        const ele = document.getElementById('background-container');
        ele.scrollTop = 100;
        ele.scrollLeft = 150;


        const mouseDownHandler = function (e) {
            pos = {
                // The current scroll
                left: ele.scrollLeft,
                top: ele.scrollTop,
                // Get the current mouse position
                x: e.clientX,
                y: e.clientY,
            };

            document.addEventListener('mousemove', mouseMoveHandler);
            // document.addEventListener('mouseup', mouseUpHandler);
        };

        const mouseMoveHandler = function (e) {
            // How far the mouse has been moved
            const dx = e.clientX - pos.x;
            const dy = e.clientY - pos.y;
        
            // Scroll the element
            ele.scrollTop = pos.top - dy;
            ele.scrollLeft = pos.left - dx;
        };

        ele.onmousedown = mouseDownHandler;

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
        this.gameContainerButtonEnlarge.value = "➖";
        this.isGameContainerEnlarged = true;
    }
    
    setMinimizedGame() {
        this.rootCss.style.setProperty('--game-container-width-current', this.gameContainerWidthMin);
        this.gameContainerButtonEnlarge.value = "➕";
        this.isGameContainerEnlarged = false;
    }

}