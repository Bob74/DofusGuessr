from dataclasses import dataclass, field
from provider.websocket.messages.IGameBaseMessage import IGameBaseMessage


@dataclass
class GameConnectMessage(IGameBaseMessage):
    client_id: str
    msg_type: str = field(default="GameConnectMessage")

    def json(self) -> dict:
        return {
            'msg_type': self.msg_type,
            'client_id': self.client_id
        }
