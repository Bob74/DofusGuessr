import logging
from fastapi import FastAPI, Request

from business.GameManager import GameManager
from business.ClientManager import ClientManager
from provider.rest.models.ClientActionReadyModel import ClientActionReadyModel
from provider.rest.models.ClientActionGuessModel import ClientActionGuessModel
from provider.rest.models.ClientActionMoveModel import ClientActionMoveModel
from provider.rest.models.ClientActionBackToStartModel import ClientActionBackToStartModel
from provider.rest.models.ClientActionHintModel import ClientActionHintModel
from provider.websocket.messages.GameUpdateImageMessage import GameUpdateImageMessage
from provider.websocket.messages.GameHintAreaMessage import GameHintAreaMessage
from common.ErrorCode import *


class RestProvider:

    def __init__(self, app: FastAPI):
        self.__app = app
        self.__register_endpoints()

    def __register_endpoints(self):
        self.__client_action_ready()
        self.__client_guess()
        self.__client_move()
        self.__client_back_to_start()
        self.__client_hint_action_area()
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

            # Calcul des nouvelles coordonnées
            x = game.map_current.x
            y = game.map_current.y
            if model.direction.lower() == 'up':
                y -= 1
            elif model.direction.lower() == 'down':
                y += 1
            elif model.direction.lower() == 'left':
                x -= 1
            elif model.direction.lower() == 'right':
                x += 1

            # Envoi de la nouvelle image au client
            new_map_id = game.map_start.get_map_id_at_coordinates(x, y)
            if new_map_id == -1:
                ErrorCode.throw(MAP_DOES_NOT_EXISTS)

            game.update_current_map(new_map_id)
            game.send_client_message(
                GameUpdateImageMessage(map_file=game.map_current.filename(web_path=True))
            )

            return {'status': 'ok'}

    def __client_back_to_start(self):
        """
        Appelé par le client Web lorsqu'il veut revenir au point de départ.
        """
        @self.__app.patch("/client/action/back-to-start")
        async def action(model: ClientActionBackToStartModel, _: Request):

            if not ClientManager().does_client_token_exists(model.client_id):
                ErrorCode.throw(CLIENT_BAD_TOKEN)

            client = ClientManager().get_client_by_token(model.client_id)
            game = GameManager().get_game_for_client(client)

            if not game.is_started:
                ErrorCode.throw(GAME_NOT_STARTED)

            # La carte courante devient la carte de départ
            game.update_current_map(game.map_start.id)

            # Envoi de la carte d'origine
            game.send_client_message(
                GameUpdateImageMessage(map_file=game.map_current.filename(web_path=True))
            )

            return {'status': 'ok'}

    def __client_hint_action_area(self):
        """
        Appelé par le client Web lorsqu'il demande un indice.
        """
        @self.__app.patch("/client/hint/action/area")
        async def action(model: ClientActionHintModel, _: Request):

            if not ClientManager().does_client_token_exists(model.client_id):
                ErrorCode.throw(CLIENT_BAD_TOKEN)

            client = ClientManager().get_client_by_token(model.client_id)
            game = GameManager().get_game_for_client(client)
            game.penalty_from_bonuses += 500

            game.send_client_message(
                GameHintAreaMessage(area_name=game.map_start.area.name)
            )

            return {'status': 'ok'}
        