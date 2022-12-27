from __future__ import annotations
from typing import TYPE_CHECKING

from business.map.SubArea import SubArea
from provider.DatabaseProvider import DatabaseProvider

if TYPE_CHECKING:
    from business.map.Map import Map


class Area:

    @property
    def id(self) -> int:
        return self._area_id

    @property
    def name(self) -> str:
        return self._area_name

    @property
    def subarea(self) -> SubArea:
        return self._subarea

    @property
    def parent_map(self) -> Map:
        return self._parent_map

    def __init__(self, parent_map: Map, area_id: int, area_name: str):
        self._area_id = area_id
        self._area_name = area_name
        self._parent_map = parent_map
        self._subarea = DatabaseProvider().get_subarea_from_area(self)

    def __str__(self) -> str:
        return f"{self.name} ({self.id})"
