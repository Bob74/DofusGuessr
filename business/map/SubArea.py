from __future__ import annotations
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from business.map.Area import Area


class SubArea:

    @property
    def id(self) -> int:
        return self._subarea_id

    @property
    def name(self) -> str:
        return self._subarea_name

    @property
    def parent_area(self) -> Area:
        return self._parent_area

    def __init__(self, parent_area: Area, subarea_id: int, subarea_name: str):
        self._subarea_id = subarea_id
        self._subarea_name = subarea_name
        self._parent_area = parent_area
