import Game from "./game.js";

'use strict';

let ws;
let game;

let div_targeted = document.getElementById('guess_container');
div_targeted.addEventListener('mouseover', function(){
    document.body.classList.remove('dragscroll');
    dragscroll.reset()
});

div_targeted.addEventListener('mouseout', function(){
    document.body.classList.add('dragscroll');
    dragscroll.reset()
});

let div_game_grid = document.getElementById('map_img');
div_game_grid.addEventListener('mouseover', function(){
    console.log('In');
    div_game_grid.style.opacity = "1";
});
div_game_grid.addEventListener('mouseout', function(){
    console.log('Out');
    div_game_grid.style.opacity = "0.6";
});

function setupWebsocket() {
    ws = new WebSocket("ws://127.0.0.1:8090/ws");

    // Listen for possible errors
    ws.addEventListener('error', (event) => {
      console.log('WebSocket error: ', event);
    });

    // Écoute des messages entrant
    ws.addEventListener('message', (event) => {
        const message = JSON.parse(event.data);
        console.log(message);
        if ('msg_type' in message) {
            switch (message.msg_type) {
                case 'GameConnectMessage':
                    // Création de la game
                    game = new Game(message.client_id, "game_container");
                    break;
                case 'GameUpdateImageMessage':
                    // Update de l'image envoyée
                    game.updateImg(message.map_file);
                    break;
                case 'GameEndMessage':
                    // Fin de partie
                    game.end(message.score, message.elapsed_time);
                    break;
                case 'GameHelpMessage':
                    // Aide
                    game.showAreaNameHint(message.zone);
                    break;
                default:
                    // Type de message non reconnu
                    console.error('Malformed message');
            }
        } else {
            console.error('Malformed message');
        }
    });
}

window.addEventListener('DOMContentLoaded', (event) => {
    setupWebsocket();
});
