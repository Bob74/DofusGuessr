from dataclasses import dataclass, field
from provider.websocket.messages.IGameBaseMessage import IGameBaseMessage


@dataclass
class GameHintAreaMessage(IGameBaseMessage):
    area_name: str
    msg_type: str = field(default="GameHintAreaMessage")

    def json(self) -> dict:
        return {
            'msg_type': self.msg_type,
            'area_name': self.area_name,
        }
