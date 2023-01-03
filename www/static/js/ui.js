'use strict';

export default class Ui {

    constructor(game) {
        this.game = game;

        /* Configuration du zoom de l'aperçu de map */
        this.isSidebarEnlarged = false;
        this.sidebarInitialWidth = document.documentElement.style.getPropertyValue('--sidebar-width');
        this.sidebarButtonEnlarge = document.getElementById("button-sidebar-enlarge");
        this.sidebarButtonEnlarge.onclick = this.toggleEnlargedSidebar.bind(this);
        
        /* Configuration du Drag and Scroll de la page */
        // this.bottomContainer = document.getElementById('bottom-container');
        this.sidebarFooter = document.querySelector('.sidebar-footer');
        // Désactivation du DragScroll quand on survol l'élément
        this.sidebarFooter.addEventListener('mouseover', this.disableDragscroll);

        // Activation du DragScroll quand on survol l'élément
        this.sidebarFooter.addEventListener('mouseout', this.enableDragscroll);
        
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