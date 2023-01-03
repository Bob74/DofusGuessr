import Game from "./game.js";

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
                    game = new Game(message.client_id);
                    break;
                case 'GameOptionsMessage':
                    // Options de la partie
                    game.setBackground(message.background.file_path, message.background.height, message.background.width);
                    game.setInitialGameTime(message.game.initial_time);
                    break;
                case 'GameUpdateBackgroundMessage':
                    // Update de l'image de fond (map full)
                    game.setBackground(message.file_path, message.height, message.width);
                    break;
                case 'GameUpdateImageMessage':
                    // Update de l'image envoyée
                    game.setImg(message.map_file);
                    break;
                case 'GameStartMessage':
                    // Début de la partie
                    game.setImg(message.map_file);
                    game.start();
                    break;
                case 'GameEndMessage':
                    // Fin de partie
                    game.end(message.score, message.remaining_time);
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
});
