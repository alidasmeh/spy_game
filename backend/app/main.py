from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

import asyncpg 
from asyncpg import Connection
from models.db import get_db_connection

from routes.api import api
from routes.socket_setup import sio_app

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api, prefix="/api")
app.mount("/ss", app=sio_app)
