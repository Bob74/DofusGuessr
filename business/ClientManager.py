from business.Client import Client
from common.Singleton import SingletonABCMeta


class ClientManager(metaclass=SingletonABCMeta):
    _CLIENTS: dict[str, Client] = dict()

    def does_client_id_exists(self, id_num: int):
        """
        Retourne si un client avec l'id demandé existe.
        """
        for client in self._CLIENTS.values():
            if client.id == id_num:
                return True
        return False

    def does_client_token_exists(self, token: str):
        """
        Retourne si un client ayant le token demandé (login_id) existe.
        """
        if token in self._CLIENTS.keys():
            return True
        return False

    def create_client(self, host: str, port: int) -> Client:
        """
        Ajoute un nouveau client à la liste.
        """
        client = Client(len(self._CLIENTS.keys()) + 1, host, port)
        self._CLIENTS[client.id] = client
        return client

    def get_client_by_token(self, token: str) -> None | Client:
        """
        Retourne le client ayant pour token celui donné en paramètre.
        """
        if token in self._CLIENTS.keys():
            return self._CLIENTS[token]
        else:
            return None

    def get_client_by_id(self, id_num: int) -> None | Client:
        """
        Retourne le client portant l'id demandé.
        """
        for client in self._CLIENTS.values():
            if client.id == id_num:
                return client
        return None

    def get_clients(self) -> (Client,):
        """
        Retourne les clients.
        """
        return tuple(self._CLIENTS.values())
