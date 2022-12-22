from abc import ABC, abstractmethod


class IGameBaseMessage(ABC):
    msg_type: str

    @abstractmethod
    def json(self):
        raise NotImplementedError
