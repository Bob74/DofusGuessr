from fastapi.responses import HTMLResponse
from starlette.staticfiles import StaticFiles
from fastapi import FastAPI


class WebsiteProvider:

    def __init__(self, app: FastAPI):
        self.__app = app
        self.__register_page_root()

    def __register_page_root(self):
        @self.__app.get("/")
        async def get():
            self.__app.mount("/static", StaticFiles(directory="www/static"), name="static")
            with open("www/index.html", encoding="UTF-8") as file:
                html_read = file.read()
            return HTMLResponse(html_read)
