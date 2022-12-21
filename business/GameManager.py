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
        game_id = str(uuid.uuid4())
        self._GAMES[game_id] = Game(client)

    def get_game_for_client(self):
        pass

