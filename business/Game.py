from __future__ import annotations
from typing import TYPE_CHECKING
import uuid


if TYPE_CHECKING:
    from business.Client import Client


class Game:

    @property
    def id(self) -> str:
        return self._id

    @property
    def client(self) -> Client:
        return self._client

    def __init__(self, client: Client):
        # ID de la partie
        self._id = str(uuid.uuid4())

        # Joueur de la partie
        self._client = client


