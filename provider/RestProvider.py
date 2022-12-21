import logging
from fastapi import FastAPI, Request

from business.ClientManager import ClientManager
from provider.rest.models.ClientActionReadyModel import ClientActionReadyModel
from common.ErrorCode import ErrorCode, CLIENT_BAD_TOKEN


class RestProvider:

    def __init__(self, app: FastAPI):
        self.__app = app
        self.__register_endpoints()

    def __register_endpoints(self):
        self.__client_action_ready()
        logging.info("[REST] All endpoints registered")

    def __client_action_ready(self):
        """
        Appelé par le client Web lorsqu'il est prêt à recevoir des données.
        """
        @self.__app.patch("/client/action/ready")
        async def action(model: ClientActionReadyModel, _: Request):

            if not ClientManager().does_client_token_exists(model.login_id):
                ErrorCode.throw(CLIENT_BAD_TOKEN)

            client = ClientManager().get_client_by_token(model.login_id)
            client.set_ready()

            return {'status': 'ok'}
