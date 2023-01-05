from pydantic import BaseModel


class ClientActionUpdateGuessModel(BaseModel):
    client_id: str
    x: int
    y: int
