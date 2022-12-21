import sqlite3
from pathlib import Path

from common.Singleton import SingletonABCMeta


class DatabaseProvider(metaclass=SingletonABCMeta):
    _db_connection: sqlite3.Connection
    _db_file: Path = Path("data", "db", "dofus_map.db")

    _sql_select_map_id_at_coordinates = "SELECT id FROM map_data WHERE x = ? AND y = ? AND lvl = ? AND outdoor = ?"
    _sql_select_coordinates_of_map_id = "SELECT x, y FROM map_data WHERE id = ?"

    def __init__(self):
        self._db_connection = sqlite3.connect(str(self._db_file.absolute()), check_same_thread=False)

    def get_map_id_at_coordinates(self, x: int, y: int, level: int, outdoor: bool) -> int:
        """
        Retourne l'id de la map aux coordonnées demandées.
        """
        cursor = self._db_connection.execute(self._sql_select_map_id_at_coordinates, (x, y, level, outdoor))
        # cursor.row_factory = lambda *args: dict(zip([d[0] for d in cursor.description], args))
        result = cursor.fetchone()
        return result[0]

    def get_coordinates_for_map_id(self, map_id: str) -> tuple[int, int]:
        """
        Retourne les coordonnées de la map demandée.
        """
        cursor = self._db_connection.execute(self._sql_select_coordinates_of_map_id, (map_id, ))
        # cursor.row_factory = lambda *args: dict(zip([d[0] for d in cursor.description], args))
        result = cursor.fetchone()
        return result[0], result[1]

    def __del__(self):
        self._db_connection.close()
