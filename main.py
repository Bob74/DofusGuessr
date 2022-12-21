import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from provider.ProviderManager import ProviderManager


# Logging
# # Removing "uvicorn" duplicate logging
# # https://github.com/encode/uvicorn/issues/1285
uvicorn_logger = logging.getLogger("uvicorn")
uvicorn_logger.removeHandler(uvicorn_logger.handlers[0])

# # Setting up basic logging config
logging.basicConfig(level=logging.DEBUG, datefmt='%d/%m/%Y %I:%M:%S',
                    format='[%(levelname)s] %(asctime)s - %(message)s')


app = FastAPI()  # Entry point for Uvicorn

origins = [
    # '*'
    "http://localhost",
    "http://localhost:8090",
    "http://127.0.0.1",
    "http://127.0.0.1:8090",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["PATCH"],
    allow_headers=["*"],
)


@app.on_event('startup')
async def startup() -> None:
    provider_manager = ProviderManager(app)
    provider_manager.start_all()

