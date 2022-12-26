from dataclasses import dataclass, field
from provider.websocket.messages.IGameBaseMessage import IGameBaseMessage


@dataclass
class GameHelpMessage(IGameBaseMessage):
    zone: str
    msg_type: str = field(default="GameHelpMessage")

    def json(self) -> dict:
        return {
            'msg_type': self.msg_type,
            'zone': self.zone,
        }
