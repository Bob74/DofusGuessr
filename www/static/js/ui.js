'use strict';

export default class Ui {

    constructor(clientId) {
        this.clientId = clientId;
        
        /* Configuration du zoom de l'aperçu de map */
        this.isSidebarEnlarged = false;
        this.sidebarInitialWidth = document.documentElement.style.getPropertyValue('--sidebar-width');
        this.sidebarButtonEnlarge = document.getElementById("button-sidebar-enlarge");
        this.sidebarButtonEnlarge.onclick = this.toggleEnlargedSidebar.bind(this);
        
        /* Configuration du Drag and Scroll de la page */
        this.guessContainer = document.getElementById('guess-container');
        this.guessContainer.addEventListener('mouseover', this.scrollableMouseOver);
        this.guessContainer.addEventListener('mouseout', this.scrollableMouseOut);
        
        /* Configuration de l'image de fond */
        const bgImgUrl = "https://solomonk.fr/img/map%201.29.jpg";
        const bgImgWidth = 5359;
        const bgImgHeight = 3869;
        document.body.style.backgroundImage = bgImgUrl;
        document.body.style.height = bgImgHeight;
        document.body.style.width = bgImgWidth;

        // Centrage de l'image de fond
        window.scroll({
            top: bgImgHeight / 2,
            left: bgImgWidth / 2,
            behavior: 'auto'
        });
    }

    /*
    * Utilisé par la lib `dragscroll` pour permettre de bouger la map de fond
    */
    scrollableMouseOver() {
        document.body.classList.remove('dragscroll');
        dragscroll.reset();
    }
    scrollableMouseOut() {
        document.body.classList.add('dragscroll');
        dragscroll.reset();
    }

    /*
    * Agrandi la sidebar pour que l'image de la map à localiser soit plus grande
    */
    toggleEnlargedSidebar() {
        if (this.isSidebarEnlarged) {
            document.documentElement.style.setProperty('--sidebar-width', this.sidebarInitialWidth);
            this.sidebarButtonEnlarge.value = "➕";
            this.isSidebarEnlarged = false;
        } else {
            document.documentElement.style.setProperty('--sidebar-width', '50%');
            this.sidebarButtonEnlarge.value = "➖";
            this.isSidebarEnlarged = true;
        }
    }

}