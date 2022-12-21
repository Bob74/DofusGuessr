from __future__ import annotations
from typing import TYPE_CHECKING
import asyncio
import logging
from fastapi import FastAPI, WebSocket
from starlette import websockets
from websockets.exceptions import ConnectionClosedOK, ConnectionClosedError

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
            logging.info(f"[{client.host}:{client.port}] Connexion du client...")

            # Accepte la connexion entrante
            await websocket.accept()

            # On attend 10s max que le websocket soit connecté
            if await self.timeout(10, self.is_websocket_connected, websocket):
                logging.error(f"[{client.host}:{client.port}] Timeout de la connexion au websocket pour le client :"
                              f"\n{client}")
                client.close()
                return
            logging.info(f"[{client.host}:{client.port}] Connexion réussie")

            # Envoi du token au client
            logging.info(f"[{client.host}:{client.port}] Envoi du token au client")
            await websocket.send_json({"login_id": client.login_id})

            # On attend la réponse du client par l'API Rest
            logging.info(f"[{client.host}:{client.port}] En attente de la réponse Rest du client...")
            if await self.timeout(10, self.is_client_ready, client):
                logging.error(f"[{client.host}:{client.port}] Timeout de la réponse Rest pour le client :"
                              f"\n{client}")
                client.close()
                return

            # While client is connected, we send them the messages
            logging.info(f"[{client.host}:{client.port}] Démarrage de la boucle de messages")
            while websocket.client_state == websockets.WebSocketState.CONNECTED:
                try:
                    # No messages, waiting
                    await asyncio.sleep(0.1)
                except ConnectionClosedOK:
                    # Client has closed the connection
                    break
                except ConnectionClosedError:
                    # Connection has closed due to an error
                    break

            logging.info(f"[{client.host}:{client.port}] Fermeture de la connexion")
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
