from __future__ import annotations
from typing import TYPE_CHECKING
import uuid
from business.Game import Game
from common.Singleton import SingletonABCMeta

if TYPE_CHECKING:
    from business.Client import Client


class GameManager(metaclass=SingletonABCMeta):
    _GAMES: dict[str, Game] = dict()

    def __init__(self):
        pass

    def new_game(self, client: Client):
        """
        Créé une nouvelle game pour un client.
        """
        game_id = str(uuid.uuid4())
        self._GAMES[game_id] = Game(client)

    def get_game_for_client(self, client: Client) -> None or Client:
        """
        Renvoi la game correspondante au client.
        """
        for game in self._GAMES.values():
            if game.client.id == client.id:
                return game
        return None

    def get_game_for_client_id(self, client_id: str) -> None or Client:
        """
        Renvoi la game correspondante au client.
        """
        for game in self._GAMES.values():
            if game.client.id == client_id:
                return game
        return None
