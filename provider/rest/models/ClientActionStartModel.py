from pydantic import BaseModel


class ClientActionStartModel(BaseModel):
    client_id: str
