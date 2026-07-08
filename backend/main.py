from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from api.routes import router

app = FastAPI(
    title="AutoML Backend",
    version="1.0.0",
)

app.include_router(router)
app.mount("/outputs", StaticFiles(directory="outputs"), name="outputs")