from dataclasses import dataclass, field
from provider.websocket.messages.IGameBaseMessage import IGameBaseMessage


@dataclass
class GameEndMessage(IGameBaseMessage):
    score: int
    remaining_time: str
    winning_x: int
    winning_y: int
    winning_area_name: str
    game_status: str = field(default="end")
    msg_type: str = field(default="GameEndMessage")

    def json(self) -> dict:
        return {
            'msg_type': self.msg_type,
            'score': self.score,
            'remaining_time': self.remaining_time,
            'winning_x': self.winning_x,
            'winning_y': self.winning_y,
            'winning_area_name': self.winning_area_name,
            'game_status': self.game_status
        }
