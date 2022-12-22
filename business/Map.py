from __future__ import annotations
import logging
from random import Random
from pathlib import Path

from provider.DatabaseProvider import DatabaseProvider


class Map:
    _MAP_FILE_PATH = Path('www', 'static', 'img', 'maps')

    @property
    def id(self) -> int:
        return self._id

    def filename(self, web_path: bool = False) -> str:
        """
        Renvoi le nom du fichier image de la map ou son chemin web complet.
        """
        found_files = list(self._MAP_FILE_PATH.glob(f"{self.id}.jpg"))
        if len(found_files):
            if web_path:
                return f"{'/'.join(self._MAP_FILE_PATH.parts[1:])}/{found_files[0].name}"
            else:
                return found_files[0].name

    @property
    def x(self) -> int:
        return self._x

    @property
    def y(self) -> int:
        return self._y

    def __init__(self, map_id: int):
        self._id: int = map_id
        self._x, self._y = DatabaseProvider().get_coordinates_for_map_id(self.id)
        logging.debug(f"[MAP] {map_id=} X:{self._x} Y:{self._y}")

    @staticmethod
    def get_random_map_id() -> int:
        """
        Choisi un id de map aléatoirement.
        """
        map_id_list = DatabaseProvider().get_all_map_id()
        random_idx = Random().randint(0, len(map_id_list))
        return map_id_list[random_idx]
