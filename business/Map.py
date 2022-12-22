from __future__ import annotations
from random import Random
from pathlib import Path

from provider.DatabaseProvider import DatabaseProvider


class Map:
    _MAP_FILE_PATH = Path('data', 'map')

    @property
    def id(self) -> int:
        return self._id

    def filename(self, full_path: bool = False) -> str:
        found_files = list(self._MAP_FILE_PATH.glob(f"{self.id}.jpg"))
        if len(found_files):
            if full_path:
                return str(found_files[0].absolute())
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

    @staticmethod
    def get_random_map_id() -> int:
        """
        Choisi un id de map aléatoirement.
        """
        map_id_list = DatabaseProvider().get_all_map_id()
        return Random().randint(0, len(map_id_list))
