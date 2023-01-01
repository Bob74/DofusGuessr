from pydantic import BaseModel


class ClientActionBackToStartModel(BaseModel):
    client_id: str
