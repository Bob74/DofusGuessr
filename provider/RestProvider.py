import logging
from fastapi import FastAPI, Request

from business.GameManager import GameManager
from business.ClientManager import ClientManager
from provider.rest.models.ClientActionReadyModel import ClientActionReadyModel
from provider.rest.models.ClientActionGuessModel import ClientActionGuessModel
from provider.rest.models.ClientActionMoveModel import ClientActionMoveModel
from common.ErrorCode import *


class RestProvider:

    def __init__(self, app: FastAPI):
        self.__app = app
        self.__register_endpoints()

    def __register_endpoints(self):
        self.__client_action_ready()
        self.__client_guess()
        self.__client_move()
        logging.info("[REST] Tous les endpoints sont enregistrés")

    def __client_action_ready(self):
        """
        Appelé par le client Web lorsqu'il est prêt à recevoir des données.
        """
        @self.__app.patch("/client/action/ready")
        async def action(model: ClientActionReadyModel, _: Request):

            if not ClientManager().does_client_token_exists(model.client_id):
                ErrorCode.throw(CLIENT_BAD_TOKEN)

            client = ClientManager().get_client_by_token(model.client_id)
            client.set_ready()

            GameManager().new_game(client)

            return {'status': 'ok'}

    def __client_guess(self):
        """
        Appelé par le client Web lorsqu'il devine des coordonnées.
        """
        @self.__app.patch("/client/action/guess")
        async def action(model: ClientActionGuessModel, _: Request):

            if not ClientManager().does_client_token_exists(model.client_id):
                ErrorCode.throw(CLIENT_BAD_TOKEN)

            client = ClientManager().get_client_by_token(model.client_id)
            game = GameManager().get_game_for_client(client)

            if not game.is_started:
                ErrorCode.throw(GAME_NOT_STARTED)

            game.guess(model.x, model.y)

            return {'status': 'ok'}

    def __client_move(self):
        """
        Appelé par le client Web lorsqu'il se déplace en jeu.
        """
        @self.__app.patch("/client/action/move")
        async def action(model: ClientActionMoveModel, _: Request):

            if not ClientManager().does_client_token_exists(model.client_id):
                ErrorCode.throw(CLIENT_BAD_TOKEN)

            client = ClientManager().get_client_by_token(model.client_id)
            game = GameManager().get_game_for_client(client)

            if not game.is_started:
                ErrorCode.throw(GAME_NOT_STARTED)

            # Todo : Calculer les coordonnées de destination et gérer le déplacement/envoi de la map au client
            pass

            return {'status': 'ok'}
