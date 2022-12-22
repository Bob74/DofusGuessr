from pydantic import BaseModel


class ClientActionReadyModel(BaseModel):
    client_id: str
