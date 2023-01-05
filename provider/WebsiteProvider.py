from fastapi.responses import HTMLResponse, FileResponse
from starlette.staticfiles import StaticFiles
from fastapi import FastAPI


class WebsiteProvider:

    _favicon_path = 'www/favicon.ico'

    def __init__(self, app: FastAPI):
        self.__app = app
        self.__register_page_root()
        self.__register_page_favicon()

    def __register_page_root(self):
        @self.__app.get("/")
        async def get():
            self.__app.mount("/static", StaticFiles(directory="www/static"), name="static")
            with open("www/index.html", encoding="UTF-8") as file:
                html_read = file.read()
            return HTMLResponse(html_read)

    def __register_page_favicon(self):
        """
        Mise à disposition du fichier favicon.ico
        On désactive l'ajout de ce chemin dans la documentation autogénérée.
        """
        @self.__app.get('/favicon.ico', include_in_schema=False)
        async def favicon():
            return FileResponse(self._favicon_path)
