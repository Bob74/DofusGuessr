import logging
import sqlite3
from pathlib import Path

from common.Singleton import SingletonABCMeta


class DatabaseProvider(metaclass=SingletonABCMeta):
    _db_connection: sqlite3.Connection
    _db_file: Path = Path("data", "db", "dofus_map.db")

    _sql_select_map_id_at_coordinates = "SELECT id FROM map_data WHERE x = ? AND y = ? AND level = ? AND is_outdoor = ?"
    _sql_select_coordinates_of_map_id = "SELECT x, y FROM map_data WHERE id = ?"
    _sql_select_all_map_id = "SELECT id, is_outdoor FROM map_data WHERE level = ? AND is_outdoor = ?"

    def __init__(self):
        self._db_connection = sqlite3.connect(str(self._db_file.absolute()), check_same_thread=False)

    def get_map_id_at_coordinates(self, x: int, y: int, level: int, outdoor: bool) -> int:
        """
        Retourne l'id de la map aux coordonnées demandées.
        """
        cursor = self._db_connection.execute(self._sql_select_map_id_at_coordinates, (x, y, level, outdoor))
        # cursor.row_factory = lambda *args: dict(zip([d[0] for d in cursor.description], args))
        result = cursor.fetchone()
        if result is None:
            return -1
        return result[0]

    def get_coordinates_for_map_id(self, map_id: int) -> tuple[int, int]:
        """
        Retourne les coordonnées de la map demandée.
        """
        cursor = self._db_connection.execute(self._sql_select_coordinates_of_map_id, (map_id, ))
        # cursor.row_factory = lambda *args: dict(zip([d[0] for d in cursor.description], args))
        result = cursor.fetchone()
        return result[0], result[1]

    def get_all_map_id(self, level: int = 0, is_outdoor: bool = True) -> list[int]:
        """
        Retourne tous les id de map.
        """
        # outdoor_condition = str()
        # if is_outdoor is not None:
        #     outdoor_condition = f" WHERE is_outdoor = {str(is_outdoor).lower()}"

        cursor = self._db_connection.execute(self._sql_select_all_map_id, (level, is_outdoor))
        # cursor.row_factory = lambda *args: dict(zip([d[0] for d in cursor.description], args))
        result = list()
        for row in cursor:
            result.append(row[0])
        return result

    def __del__(self):
        self._db_connection.close()
