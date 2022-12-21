from fastapi import HTTPException


class ErrorCode:

    @property
    def name(self) -> str:
        return self._name

    @property
    def internal_code(self) -> int:
        return self._internal_code

    @property
    def http_code(self) -> int:
        return self._http_code

    @property
    def label(self) -> str:
        return self._label

    def __init__(self, name: str, internal_code: int, http_code:int, label: str):
        self._name = name
        self._internal_code = internal_code
        self._http_code = http_code
        self._label = label

    def __str__(self):
        return f"{self.name} ({self.internal_code}) - {self.label}"

    @staticmethod
    def throw(error_code: 'ErrorCode'):
        """
        Throw a HTTPException using this ErrorCode details.
        """
        details = {
            'name': error_code.name,
            'internal_code': error_code.internal_code,
            'label': error_code.label
        }
        raise HTTPException(status_code=error_code.http_code, detail=details)


# Display errors
CLIENT_ID_DOES_NOT_EXISTS = ErrorCode(name='CLIENT_ID_DOES_NOT_EXISTS', internal_code=0x00000401,
                                      http_code=404, label="No client found for this id")
CLIENT_BAD_TOKEN = ErrorCode(name='CLIENT_BAD_TOKEN', internal_code=0x00000402, http_code=500,
                             label="The token is not valid")

