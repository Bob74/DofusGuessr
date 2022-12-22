from __future__ import annotations

import logging
from typing import TYPE_CHECKING
import uuid
import math
from datetime import datetime, timedelta

from business.Map import Map
from provider.websocket.messages.GameStartMessage import GameStartMessage
from provider.websocket.messages.GameEndMessage import GameEndMessage

if TYPE_CHECKING:
    from business.Client import Client
    from provider.websocket.messages.IGameBaseMessage import IGameBaseMessage


class Game:

    _MAX_POINTS = 5000

    @property
    def id(self) -> str:
        return self._id

    @property
    def client(self) -> Client:
        return self._client

    @property
    def is_started(self) -> bool:
        return self._is_started

    @property
    def timestamp_start(self) -> datetime:
        return self._timestamp_start

    @property
    def timestamp_stop(self) -> None | datetime:
        return self._timestamp_stop

    @property
    def timestamp_duration(self) -> timedelta:
        if self._is_started:
            return datetime.now() - self._timestamp_start
        else:
            return self.timestamp_stop - self.timestamp_start

    def __init__(self, client: Client):
        # ID de la partie
        self._id = str(uuid.uuid4())

        # Joueur de la partie
        self._client = client

        # Map à deviner
        self.map = Map(Map.get_random_map_id())

        # Démarrage de la partie et calcul du temps
        self._is_started = True
        self._timestamp_start = datetime.now()
        self._timestamp_stop = None

        self.send_client_message(GameStartMessage(map_file=self.map.filename(web_path=True)))

    def stop(self):
        """
        Arrête la partie.
        """
        self._is_started = False
        self._timestamp_stop = datetime.now()

    def send_client_message(self, message: IGameBaseMessage):
        """
        Envoi le message dans la queue du client.
        """
        self.client.message_queue.put(message)

    def guess(self, guess_x: int, guess_y: int) -> int:
        """
        Termine la partie et envoie le score au front.
        """
        score = self.compute_game_points(guess_x, guess_y)
        logging.debug(f"Score du joueur {self.client.host}:{self.client.port} : {score}")
        self.send_client_message(GameEndMessage(score=score, elapsed_time=str(self.timestamp_duration)))
        self.stop()
        return score

    def compute_game_points(self, guess_x: int, guess_y: int) -> int:
        """
        Calcul les points gagnés sur la partie.
        """

        # Todo : utiliser une fonction logarithmique pour enlever + de points + on est loin
        result = self._MAX_POINTS - (
            math.fabs(self.map.x) - math.fabs(guess_x) + math.fabs(self.map.y) - math.fabs(guess_y)
        ) * 500

        return int(sorted((0, result, self._MAX_POINTS))[1])
