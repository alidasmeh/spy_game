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


#     query = "SELECT * FROM players"
#     items = await conn.fetch(query)
#     return items
# ----------
#     try:
#         inserted_id = await conn.fetchval('INSERT INTO players (username, email) VALUES($1, $2) RETURNING id', username, email)

#     except asyncpg.exceptions.UniqueViolationError as e:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail=f"Error: A unique constraint violation occurred: {e}"
#         )
    
#     except Exception as e:
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=f"Error: not defined error : {e}"
#         )