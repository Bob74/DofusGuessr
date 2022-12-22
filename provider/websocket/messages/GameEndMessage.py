from dataclasses import dataclass, field
from provider.websocket.messages.IGameBaseMessage import IGameBaseMessage


@dataclass
class GameEndMessage(IGameBaseMessage):
    score: int
    elapsed_time: str
    game_status: str = field(default="end")
    msg_type: str = field(default="GameEndMessage")

    def json(self) -> dict:
        return {
            'msg_type': self.msg_type,
            'score': self.score,
            'elapsed_time': self.elapsed_time,
            'game_status': self.game_status
        }