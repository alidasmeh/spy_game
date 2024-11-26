from fastapi import (
    APIRouter,
    Depends,
    FastAPI,
    HTTPException,
    Request,
    Response,
    status,
    Body
)

from models.db import get_db_connection, connect_to_db

api = APIRouter(tags=["api"])

@api.get("/")
def hello_world():
    return {"message": "API"}

@api.get("/cleandb")
async def cleandb():
    conn = await connect_to_db()
    await conn.execute(f"DELETE FROM players; DELETE FROM rounds; DELETE FROM trials; DELETE FROM games;")

    return 'DONE'


