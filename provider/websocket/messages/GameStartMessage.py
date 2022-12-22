from dataclasses import dataclass, field
from provider.websocket.messages.IGameBaseMessage import IGameBaseMessage


@dataclass
class GameStartMessage(IGameBaseMessage):
    map_file: str
    msg_type: str = field(default="GameStartMessage")

    def json(self) -> dict:
        return {
            'msg_type': self.msg_type,
            'map_file': self.map_file
        }
