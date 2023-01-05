from pydantic import BaseModel


class ClientActionGuessModel(BaseModel):
    client_id: str

