from __future__ import annotations
from typing import TYPE_CHECKING

import logging
import uuid
import math
from datetime import datetime, timedelta

from business.map.Map import Map
from provider.websocket.messages.GameUpdateBackgroundMessage import GameUpdateBackgroundMessage
from provider.websocket.messages.GameUpdateImageMessage import GameUpdateImageMessage
from provider.websocket.messages.GameEndMessage import GameEndMessage

if TYPE_CHECKING:
    from business.Client import Client
    from provider.websocket.messages.IGameBaseMessage import IGameBaseMessage


class Game:

    _MAX_POINTS = 5000
    _BACKGROUND_IMAGE = 'static/img/bg/map_full.jpg'
    _BACKGROUND_HEIGHT = 3869
    _BACKGROUND_WIDTH = 5359

    @property
    def id(self) -> str:
        return self._id

    @property
    def background_map_fullpath(self) -> str:
        return self._BACKGROUND_IMAGE

    @property
    def client(self) -> Client:
        return self._client

    @property
    def map_start(self) -> Map:
        return self._map_start

    @property
    def map_current(self) -> Map:
        return self._map_current

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

    @property
    def penalty_from_bonuses(self) -> int:
        return self._penalty

    @penalty_from_bonuses.setter
    def penalty_from_bonuses(self, value) -> None:
        self._penalty += value

    def __init__(self, client: Client):
        # ID de la partie
        self._id = str(uuid.uuid4())

        # Joueur de la partie
        self._client = client

        # Envoi de l'image de fond
        self.send_client_message(
            GameUpdateBackgroundMessage(
                file_path=self.background_map_fullpath,
                height=self._BACKGROUND_HEIGHT,
                width=self._BACKGROUND_WIDTH
            )
        )

        # Map à deviner
        self._level = 0
        self._is_outdoor = True

        self._map_start = Map(
            map_id=Map.get_random_map_id(level=self._level, is_outdoor=self._is_outdoor),
            level=self._level,
            is_outdoor=self._is_outdoor
        )
        self._map_current = self._map_start

        # Démarrage de la partie
        self._is_started = True

        # Statistics de la partie
        self._timestamp_start = datetime.now()
        self._timestamp_stop = None
        self._penalty = 0

        # Envoi de l'image à chercher
        self.send_client_message(GameUpdateImageMessage(map_file=self.map_start.filename(web_path=True)))

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
        # Combien de cellules d'écart il faut pour arriver à 0 points ?
        distance_to_zero_points = 64

        # Calcul de la distance entre l'origine et le guess
        origin = [self.map_start.x, self.map_start.y]
        guess = [guess_x, guess_y]
        distance = math.dist(origin, guess)

        # Application des pénalités : distance du point visé + pénalités des bonus utilisés
        penalty_from_distance = int(distance * (self._MAX_POINTS / distance_to_zero_points))
        result = self._MAX_POINTS - penalty_from_distance - self.penalty_from_bonuses

        return sorted((0, int(result), self._MAX_POINTS))[1]

    def update_current_map(self, map_id):
        """
        Met à jour la carte courante avec la position actuelle du joueur.
        """
        self._map_current = Map(map_id=map_id, level=self._map_start.level, is_outdoor=self._map_start.is_outdoor)
