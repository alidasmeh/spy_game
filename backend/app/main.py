from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy.ext.asyncio import AsyncSession
import asyncpg 
from asyncpg import Connection
from models.db import get_db_connection

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI!"}

@app.get("/hi")
def hi_root():
    return {"message": "Hi"}

@app.get("/get")
async def bye_root(conn: Connection = Depends(get_db_connection)):
    query = "SELECT * FROM players"
    items = await conn.fetch(query)
    return items

@app.get("/set_name/{username}/{email}")
async def set_name(username: str, email: str, conn: Connection = Depends(get_db_connection)):
    
    try:
        inserted_id = await conn.fetchval('INSERT INTO players (username, email) VALUES($1, $2) RETURNING id', username, email)

    except asyncpg.exceptions.UniqueViolationError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error: A unique constraint violation occurred: {e}"
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error: not defined error : {e}"
        )

    return {"inserted_id": inserted_id}
