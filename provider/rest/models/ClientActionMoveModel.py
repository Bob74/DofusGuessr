from pydantic import BaseModel


class ClientActionMoveModel(BaseModel):
    client_id: str
    direction: str
