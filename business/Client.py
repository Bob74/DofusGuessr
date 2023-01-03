import uuid
from queue import SimpleQueue
from datetime import datetime, timedelta


class Client:
    @property
    def id(self) -> str:
        return self._id

    @property
    def number(self) -> int:
        return self._number

    @property
    def timestamp_start(self) -> datetime:
        return self._timestamp_start

    @property
    def timestamp_stop(self) -> None | datetime:
        return self._timestamp_stop

    @property
    def timestamp_duration(self) -> timedelta:
        if self._connected:
            return datetime.now() - self._timestamp_start
        else:
            return self.timestamp_stop - self.timestamp_start

    @property
    def is_connected(self) -> bool:
        return self._connected

    @property
    def is_ready(self) -> bool:
        return self._is_ready

    @property
    def host(self) -> str:
        return self._host

    @property
    def port(self) -> int:
        return self._port

    @property
    def message_queue(self) -> SimpleQueue:
        return self._message_queue

    def __init__(self, num: int, host: str, port: int):
        self._number = num
        self._id = str(uuid.uuid4())
        self._timestamp_start = datetime.now()
        self._timestamp_stop = None
        self._connected = True
        self._is_ready = False
        self._host = host
        self._port = port
        self._message_queue = SimpleQueue()

    def set_ready(self):
        self._is_ready = True

    def close(self):
        self._connected = False
        self._timestamp_stop = datetime.now()

    def info(self) -> str:
        timestamp_start = self.timestamp_start.strftime('%d/%m/%Y %H:%M:%S')
        timestamp_stop = self.timestamp_stop.strftime('%d/%m/%Y %H:%M:%S') if self.timestamp_stop is not None else ''
        return f"Id: {self.id}\n" \
               f"Timestamp start: {timestamp_start}\n" \
               f"Timestamp stop: {timestamp_stop}\n" \
               f"Timestamp duration: {str(self.timestamp_duration)}\n" \
               f"Status: {'connected' if self.is_connected else 'disconnected'}\n" \
               f"Is Ready: {self.is_ready}\n" \
               f"IP and port: {self.host}:{self.port}"

    def __del__(self):
        self.close()

    def __str__(self) -> str:
        return f"{self.host}:{self.port}"
