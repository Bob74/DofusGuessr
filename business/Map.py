from __future__ import annotations
import logging
from random import Random
from pathlib import Path

from provider.DatabaseProvider import DatabaseProvider


G_MAP_FILE_PATH = Path('www', 'static', 'img', 'maps')


class Map:

    @property
    def id(self) -> int:
        return self._id

    @property
    def level(self) -> int:
        return self._level

    @property
    def is_outdoor(self) -> bool:
        return self._is_outdoor

    def filename(self, web_path: bool = False) -> str:
        """
        Renvoi le nom du fichier image de la map ou son chemin web complet.
        """
        return self.get_filename(map_id=self.id, web_path=web_path)

    @property
    def x(self) -> int:
        return self._x

    @property
    def y(self) -> int:
        return self._y

    def __init__(self, map_id: int, level: int, is_outdoor: bool):
        self._id: int = map_id
        self._level = level
        self._is_outdoor = is_outdoor
        self._x, self._y = DatabaseProvider().get_coordinates_for_map_id(self.id)
        logging.debug(f"[MAP] {map_id=} X:{self._x} Y:{self._y}")

    def get_map_id_at_coordinates(self, x: int, y: int) -> int:
        """
        Retourne l'id de map aux coordonnées demandées au même level que celui de la map en cours.
        """
        # On cherche la map au même level et en intérieur ou extérieur comme la map courante
        result = DatabaseProvider().get_map_id_at_coordinates(x, y, self.level, self.is_outdoor)
        logging.debug(result)
        # Si on n'a aucun résultat, on change l'intérieur pour l'extérieur et inversement
        if result == -1:
            result = DatabaseProvider().get_map_id_at_coordinates(x, y, self.level, not self.is_outdoor)
        logging.debug(result)
        return result

    @staticmethod
    def get_random_map_id(level: int, is_outdoor: bool) -> int:
        """
        Choisi un id de map aléatoirement.
        """
        map_id_list = DatabaseProvider().get_all_map_id(level=level, is_outdoor=is_outdoor)
        random_idx = Random().randint(0, len(map_id_list))
        return map_id_list[random_idx]

    @staticmethod
    def get_filename(map_id: int, web_path: bool = False):
        """
        Renvoi le nom du fichier image de la map ou son chemin web complet.
        """
        found_files = list(G_MAP_FILE_PATH.glob(f"{map_id}.jpg"))
        if len(found_files):
            if web_path:
                return f"{'/'.join(G_MAP_FILE_PATH.parts[1:])}/{found_files[0].name}"
            else:
                return found_files[0].name

    def get_zone_map(self):
        zone = DatabaseProvider().get_area_name_of_map_id(map_id=self._id)
        return zone
