from __future__ import annotations
from typing import TYPE_CHECKING
import asyncio
import logging
from fastapi import FastAPI, WebSocket
from starlette import websockets
from websockets.exceptions import ConnectionClosedOK, ConnectionClosedError

from provider.websocket.messages.GameConnectMessage import GameConnectMessage
from business.ClientManager import ClientManager

if TYPE_CHECKING:
    from business.Client import Client


class WebsocketProvider:

    def __init__(self, app: FastAPI):
        self.__app = app
        self.__register_websocket()

    def __register_websocket(self):
        @self.__app.websocket("/ws")
        async def websocket_endpoint(websocket: WebSocket):

            # Logging du client
            client = ClientManager().create_client(websocket.client.host, websocket.client.port)
            logging.info(f"[{client}] Connexion du client...")

            # Accepte la connexion entrante
            await websocket.accept()

            # On attend 10s max que le websocket soit connecté
            if await self.timeout(10, self.is_websocket_connected, websocket):
                logging.error(f"[{client}] Timeout de la connexion au websocket pour le client :"
                              f"\n{client.info()}")
                client.close()
                return
            logging.info(f"[{client}] Connexion réussie")

            # Envoi du token au client
            logging.info(f"[{client}] Envoi du token au client")
            await websocket.send_json(GameConnectMessage(client_id=client.id).json())

            # On attend la réponse du client par l'API Rest
            logging.info(f"[{client}] En attente de la réponse Rest du client...")
            if await self.timeout(10, self.is_client_ready, client):
                logging.error(f"[{client}] Timeout de la réponse Rest pour le client :"
                              f"\n{client.info()}")
                client.close()
                return

            # Tant que le client est connecté, on envoie les messages
            logging.info(f"[{client}] Démarrage de la boucle de messages")
            while websocket.client_state == websockets.WebSocketState.CONNECTED:
                try:
                    # Tant qu'on a des messages dans la queue, on les lit
                    while not client.message_queue.empty():
                        # Lecture d'un message
                        to_send = client.message_queue.get()
                        logging.debug(f"[WEBSOCKET] Sending '{to_send.msg_type}' message: {to_send.json()}")

                        # Envoi du message au front
                        await websocket.send_json(to_send.json())

                    # Pas de message, on attend
                    await asyncio.sleep(0.1)
                except ConnectionClosedOK:
                    # Fermeture de la connexion par le client
                    break
                except ConnectionClosedError:
                    # Fermeture de la connexion à cause d'une erreur
                    break

            logging.info(f"[{client}] Fermeture de la connexion")
            client.close()
            await websocket.close()

    @staticmethod
    async def timeout(seconds: int, condition_function, *args) -> bool:
        timeout = seconds
        while not condition_function(*args) and timeout > 0:
            timeout -= 1
            await asyncio.sleep(1)

        # Timeout
        if timeout == 0:
            return True
        return False

    @staticmethod
    def is_websocket_connected(websocket: WebSocket):
        return websocket.client_state == websockets.WebSocketState.CONNECTED

    @staticmethod
    def is_client_ready(client: Client):
        return client.is_ready
