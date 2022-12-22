import Game from "./game.js";
import sendRestMessage from "./rest.js";

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
                    game = new Game(message.client_id, "game_container");

                    // Validation de l'API Rest en renvoyant le message
                    sendRestMessage("PATCH", "/client/action/ready", JSON.stringify({
                        "client_id": message.client_id
                    }))
                    break;
                case 'GameStartMessage':
                    // Affichage de l'image envoyée
                    document.getElementById("map_img").src = message.map_file;
                    break;
                case 'GameEndMessage':
                    game.doEnd(message.score, message.elapsed_time);
                    break;
                default:
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
