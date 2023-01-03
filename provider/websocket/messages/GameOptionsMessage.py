from dataclasses import dataclass, field
from provider.websocket.messages.IGameBaseMessage import IGameBaseMessage


@dataclass
class GameOptionsMessage(IGameBaseMessage):
    client_id: str
    initial_time: int
    file_path: str
    height: int
    width: int
    msg_type: str = field(default="GameOptionsMessage")

    def json(self) -> dict:
        return {
            'msg_type': self.msg_type,
            'client_id': self.client_id,
            'game': {
                'initial_time': self.initial_time
            },
            'background': {
                'file_path': self.file_path,
                'height': self.height,
                'width': self.width
            }
        }
