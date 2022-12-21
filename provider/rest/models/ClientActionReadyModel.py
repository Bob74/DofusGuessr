from pydantic import BaseModel


class ClientActionReadyModel(BaseModel):
    login_id: str
