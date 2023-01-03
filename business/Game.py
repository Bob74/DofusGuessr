from __future__ import annotations
from typing import TYPE_CHECKING

import logging
import uuid
import math
from time import sleep
from datetime import datetime, timedelta
from threading import Thread, Event

from business.map.Map import Map
from business.ClientManager import ClientManager
from provider.websocket.messages.GameOptionsMessage import GameOptionsMessage
from provider.websocket.messages.GameStartMessage import GameStartMessage
from provider.websocket.messages.GameEndMessage import GameEndMessage

if TYPE_CHECKING:
    from business.Client import Client
    from provider.websocket.messages.IGameBaseMessage import IGameBaseMessage


class Game:

    _DURATION_SECONDS = 5 * 60  # 5 minutes
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
    def timer_initial_time(self) -> timedelta:
        return self._time_initial

    @property
    def timer_remaining_time(self) -> timedelta:
        return self._time_remaining

    @property
    def timer_elapsed_time(self) -> timedelta:
        return self.timer_initial_time - self.timer_remaining_time

    @property
    def score(self) -> int:
        return self._score

    @property
    def penalty_from_bonuses(self) -> int:
        return self._penalty

    @penalty_from_bonuses.setter
    def penalty_from_bonuses(self, value) -> None:
        self._penalty += value

    @property
    def current_guess_x(self) -> int:
        return self._current_guess_x

    @current_guess_x.setter
    def current_guess_x(self, value) -> None:
        self._current_guess_x += value

    @property
    def current_guess_y(self) -> int:
        return self._current_guess_y

    @current_guess_y.setter
    def current_guess_y(self, value) -> None:
        self._current_guess_y += value

    def __init__(self, client: Client):
        # ID de la partie
        self._id = str(uuid.uuid4())

        # Joueur de la partie
        self._client = client

        # Map à deviner
        self._level = 0
        self._is_outdoor = True

        self._map_start = Map(
            map_id=Map.get_random_map_id(level=self._level, is_outdoor=self._is_outdoor),
            level=self._level,
            is_outdoor=self._is_outdoor
        )
        self._map_current = self._map_start

        # État de la partie
        self._is_started = False

        # Statistics de la partie
        self._time_initial = timedelta(seconds=self._DURATION_SECONDS)
        self._time_remaining = timedelta(seconds=self._DURATION_SECONDS)
        self._score = 0
        self._penalty = 0
        self._current_guess_x = 0
        self._current_guess_y = 0

        # Thread de décompte du timer
        self._event_game_timer = Event()
        self._thread_game_timer = Thread(
            name="Timer thread",
            target=self.thread_timer,
            args=(self._event_game_timer, )
        )

        # Envoi des options de la partie
        self.send_client_message(
            GameOptionsMessage(
                client_id=self._client.id,
                initial_time=self.timer_initial_time.seconds,
                file_path=self.background_map_fullpath,
                height=self._BACKGROUND_HEIGHT,
                width=self._BACKGROUND_WIDTH
            )
        )

    def start(self):
        """
        Démarre la partie.
        """
        # Envoi de l'image à chercher
        self.send_client_message(GameStartMessage(map_file=self.map_start.filename(web_path=True)))
        self._thread_game_timer.start()

        # Démarrage de la partie
        self._is_started = True

    def stop(self):
        """
        Arrête la partie.
        """
        # Stop du timer
        self._event_game_timer.set()

        # Arrêt de la partie
        self._is_started = False

        # Envoi du message de fin de partie au client
        self.send_client_message(GameEndMessage(score=self._score, remaining_time=str(self.timer_remaining_time)))
        ClientManager().delete_client(self._client.id)

    def thread_timer(self, e: Event):
        """
        On décroit le temps du timer tant qu'il reste du temps ou que l'event de fin n'a pas été déclenché.
        """
        while self._time_remaining.seconds > 0 and not e.is_set():
            if self._time_remaining.seconds < 1.0:
                sleep(self._time_remaining.seconds)
            else:
                sleep(1.0)
            self._time_remaining -= timedelta(seconds=1.0)

        # Fin de la partie si le timer arrive à la fin ou si la partie est annulée en cours de route
        if self._is_started:
            self.stop()

    def send_client_message(self, message: IGameBaseMessage):
        """
        Envoi le message dans la queue du client.
        """
        self.client.message_queue.put(message)

    def update_current_guess(self, guess_x: int, guess_y: int):
        """
        Met à jour les coordonnées devinées par le joueur.
        """
        self.current_guess_x = guess_x
        self.current_guess_y = guess_y

    def guess(self, guess_x: int, guess_y: int):
        """
        Termine la partie et envoie le score au front.
        """
        self._score = self.compute_game_points(guess_x, guess_y)
        logging.debug(f"Score du joueur {self.client.host}:{self.client.port} : {self._score}")
        self.stop()

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
