from dataclasses import dataclass, field
from provider.websocket.messages.IGameBaseMessage import IGameBaseMessage


@dataclass
class GameUpdateBackgroundMessage(IGameBaseMessage):
    file_path: str
    height: int
    width: int
    msg_type: str = field(default="GameUpdateBackgroundMessage")

    def json(self) -> dict:
        return {
            'msg_type': self.msg_type,
            'file_path': self.file_path,
            'height': self.height,
            'width': self.width
        }
