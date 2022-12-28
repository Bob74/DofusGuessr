import Game from "./game.js";
import Ui from "./ui.js";

'use strict';

let ws;
let game;

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
                    game = new Game(message.client_id, "sidebar");
                    break;
                case 'GameUpdateImageMessage':
                    // Update de l'image envoyée
                    game.updateImg(message.map_file);
                    break;
                case 'GameEndMessage':
                    // Fin de partie
                    game.end(message.score, message.elapsed_time);
                    break;
                case 'GameHintAreaMessage':
                    // Indice : Nom de la zone
                    game.showAreaNameHint(message.area_name);
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
    new Ui();
});
