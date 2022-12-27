from pydantic import BaseModel


class ClientActionHintModel(BaseModel):
    client_id: str
